import { Account } from "./account.model.js";
import { Deposit } from "../deposits/deposit.model.js";
import { Withdrawal } from "../withdrawal/withdrawal.model.js";
import { Transfer } from "../transfers/transfer.model.js";
import { convertCurrency } from "../../utils/currency.services.js";
import { Op } from "sequelize";

const generateAccountNumber = () => {
  const numbers = Array.from({ length: 12 }, () =>
    Math.floor(Math.random() * 10),
  ).join("");

  return numbers.replace(/(\d{4})(\d{4})(\d{2})(\d{2})/, "$1 $2 $3 $4");
};

export const createAccountRecord = async (accountData) => {
  try {
    let accountNumber = generateAccountNumber();
    let exists = await Account.findOne({ where: { accountNumber } });

    while (exists) {
      accountNumber = generateAccountNumber();
      exists = await Account.findOne({ where: { accountNumber } });
    }

    const newAccount = await Account.create({
      userId: accountData.userId,
      type: accountData.type,
      accountNumber: accountNumber,
      balance: 0.0,
      currency: "GTQ",
      status: false,
    });

    return newAccount;
  } catch (error) {
    console.error("Error en createAccountRecord:", error.message);
    throw new Error(`No se pudo crear la cuenta bancaria: ${error.message}`);
  }
};

export const disableAccount = async (accountNumberParam) => {
  try {
    const account = await Account.findOne({
      where: { accountNumber: accountNumberParam },
    });

    if (!account) {
      throw new Error("La cuenta no existe.");
    }

    if (account.status === false) {
      throw new Error("La cuenta ya se encuentra deshabilitada.");
    }

    account.status = false;
    await account.save();

    return account;
  } catch (error) {
    console.error("Error en disableAccount Service:", error.message);
    throw error;
  }
};

export const availableAccount = async (accountNumberParam) => {
  try {
    const account = await Account.findOne({
      where: { accountNumber: accountNumberParam },
    });

    if (!account) {
      throw new Error("La cuenta no existe.");
    }

    if (account.status === true) {
      throw new Error("La cuenta ya se encuentra habilitada.");
    }

    account.status = true;
    await account.save();

    return account;
  } catch (error) {
    console.error("Error en availableAccount Service:", error.message);
    throw error;
  }
};

export const getMyAccountStatement = async (
  accountId,
  { targetCurrency = "GTQ", authenticatedUserId },
) => {
  try {
    const account = await Account.findByPk(accountId);
    if (!account) throw new Error("Cuenta no encontrada.");

    if (account.userId !== authenticatedUserId) {
      throw new Error("Acceso denegado: Esta cuenta no te pertenece.");
    }

    const [deposits, withdrawals, transfersSent, transfersReceived] =
      await Promise.all([
        Deposit.findAll({ where: { accountId } }),
        Withdrawal.findAll({ where: { accountNumber: account.accountNumber } }),
        Transfer.findAll({
          where: { senderAccountNumber: account.accountNumber },
        }),
        Transfer.findAll({
          where: { receiverAccountNumber: account.accountNumber },
        }),
      ]);

    let history = [
      ...deposits.map((d) => ({
        date: d.createdAt,
        type: "DEPOSITO",
        description: d.description || "Abono",
        amount: parseFloat(d.amount),
      })),
      ...withdrawals.map((w) => ({
        date: w.createdAt,
        type: "RETIRO",
        description: "Retiro Cajero/Ventanilla",
        amount: -parseFloat(w.amount),
      })),
      ...transfersSent.map((t) => ({
        date: t.createdAt,
        type: "TRANSFERENCIA ENVIADA",
        description: `A: ${t.receiverAccountNumber}`,
        amount: -parseFloat(t.amount),
      })),
      ...transfersReceived.map((t) => ({
        date: t.createdAt,
        type: "TRANSFERENCIA RECIBIDA",
        description: `De: ${t.senderAccountNumber}`,
        amount: parseFloat(t.amount),
      })),
    ];

    history.sort((a, b) => new Date(b.date) - new Date(a.date));

    let balanceFinal = parseFloat(account.balance);
    if (targetCurrency !== "GTQ") {
      const conversionInfo = await convertCurrency(1, "GTQ", targetCurrency);
      const rate = conversionInfo.rate;

      balanceFinal = parseFloat((account.balance * rate).toFixed(2));

      history = history.map((item) => {
        const convertedValue = parseFloat(
          (Math.abs(item.amount) * rate).toFixed(2),
        );
        return {
          ...item,
          amount: item.amount < 0 ? -convertedValue : convertedValue,
          currency: targetCurrency,
        };
      });
    }

    return {
      accountNumber: account.accountNumber,
      accountType: account.type,
      balance: balanceFinal,
      currency: targetCurrency,
      movements: history,
    };
  } catch (error) {
    throw error;
  }
};

export const getAllBankMovements = async ({ order = "DESC" }) => {
  try {
    const [deposits, withdrawals, transfers] = await Promise.all([
      Deposit.findAll({
        include: [
          {
            model: Account,
            attributes: ["accountNumber"],
          },
        ],
      }),
      Withdrawal.findAll(),
      Transfer.findAll(),
    ]);

    let generalHistory = [
      ...deposits.map((d) => ({
        date: d.createdAt,
        type: "DEPOSITO",
        account: d.Account ? d.Account.accountNumber : "Cuenta no encontrada",
        amount: parseFloat(d.amount),
      })),
      ...withdrawals.map((w) => ({
        date: w.createdAt,
        type: "RETIRO",
        account: w.accountNumber,
        amount: -parseFloat(w.amount),
      })),
      ...transfers.map((t) => ({
        date: t.createdAt,
        type: "TRANSFERENCIA",
        from: t.senderAccountNumber,
        to: t.receiverAccountNumber,
        amount: parseFloat(t.amount),
      })),
    ];

    generalHistory.sort((a, b) => {
      return order.toUpperCase() === "ASC"
        ? new Date(a.date) - new Date(b.date)
        : new Date(b.date) - new Date(a.date);
    });

    return generalHistory;
  } catch (error) {
    throw new Error(`Error al obtener movimientos generales: ${error.message}`);
  }
};

export const getAdminAccountStatement = async (
  accountId,
  { order = "DESC" },
) => {
  try {
    const account = await Account.findByPk(accountId);
    if (!account) throw new Error("La cuenta solicitada no existe.");

    const [deposits, withdrawals, transfersSent, transfersReceived] =
      await Promise.all([
        Deposit.findAll({ where: { accountId } }),
        Withdrawal.findAll({ where: { accountNumber: account.accountNumber } }),
        Transfer.findAll({
          where: { senderAccountNumber: account.accountNumber },
        }),
        Transfer.findAll({
          where: { receiverAccountNumber: account.accountNumber },
        }),
      ]);

    let history = [
      ...deposits.map((d) => ({
        date: d.createdAt,
        type: "DEPOSITO",
        amount: parseFloat(d.amount),
      })),
      ...withdrawals.map((w) => ({
        date: w.createdAt,
        type: "RETIRO",
        amount: -parseFloat(w.amount),
      })),
      ...transfersSent.map((t) => ({
        date: t.createdAt,
        type: "TRANS_ENVIADA",
        to: t.receiverAccountNumber,
        amount: -parseFloat(t.amount),
      })),
      ...transfersReceived.map((t) => ({
        date: t.createdAt,
        type: "TRANS_RECIBIDA",
        from: t.senderAccountNumber,
        amount: parseFloat(t.amount),
      })),
    ];

    history.sort((a, b) => {
      return order.toUpperCase() === "ASC"
        ? a.amount - b.amount
        : b.amount - a.amount;
    });

    return {
      info: {
        accountNumber: account.accountNumber,
        balance: account.balance,
        ownerId: account.userId,
      },
      movements: history,
    };
  } catch (error) {
    throw error;
  }
};

export const getAccountSummary = async (accountId, authenticatedUserId) => {
  try {
    const account = await Account.findByPk(accountId);

    if (!account) {
      throw new Error("Cuenta no encontrada.");
    }

    if (account.userId !== authenticatedUserId) {
      throw new Error("Acceso denegado.");
    }

    const rawNumber = account.accountNumber;
    const maskedNumber = `**** **** **${rawNumber.slice(-2)}`;

    return {
      accountNumber: maskedNumber,
      balance: parseFloat(account.balance).toFixed(2),
      currency: account.currency,
    };
  } catch (error) {
    console.error("Error en getAccountSummary:", error.message);
    throw error;
  }
};

export const getAllAccounts = async ({ order = "DESC" }) => {
  try {
    const accounts = await Account.findAll({
      order: [["createdAt", order.toUpperCase()]],
    });

    return accounts;
  } catch (error) {
    console.error("Error en getAllAccounts Service:", error.message);
    throw new Error(`Error al obtener todas las cuentas: ${error.message}`);
  }
};

export const getAccountsByUserId = async (userId, { order = "DESC" }) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: userId },
      order: [["createdAt", order.toUpperCase()]],
    });

    return accounts;
  } catch (error) {
    console.error("Error en getAccountsByUserId Service:", error.message);
    throw new Error(
      `Error al obtener las cuentas del usuario: ${error.message}`,
    );
  }
};
