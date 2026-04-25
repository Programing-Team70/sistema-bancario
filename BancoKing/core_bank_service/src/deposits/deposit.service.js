import { Account } from "../account/account.model.js";
import { Deposit } from "./deposit.model.js";
import { sequelize } from "../../configs/db.js";

export const makeDeposit = async ({ accountNumber, amount, description }) => {
  const t = await sequelize.transaction();

  try {
    const account = await Account.findOne({ where: { accountNumber } });
    if (!account) throw new Error("La cuenta destino no existe.");

    const depositAmount = parseFloat(amount);

    if (account.status === false) {
      const previousDeposits = await Deposit.count({
        where: { accountId: account.id },
      });

      if (previousDeposits === 0) {
        if (depositAmount >= 50) {
          account.status = true;
        } else {
          throw new Error(
            "Cuenta nueva. El depósito inicial mínimo para activarla es de Q50.00",
          );
        }
      } else {
        throw new Error(
          "No se pueden realizar depósitos. Esta cuenta ha sido deshabilitada por el banco.",
        );
      }
    }

    account.balance = parseFloat(account.balance) + depositAmount;
    await account.save({ transaction: t });

    const deposit = await Deposit.create(
      {
        accountId: account.id,
        amount: depositAmount,
        description: description || "Depósito en efectivo",
      },
      { transaction: t },
    );

    await t.commit();
    return { account, deposit };
  } catch (error) {
    if (t) await t.rollback();
    throw error;
  }
};

export const updateDepositRecord = async (
  depositId,
  { newAmount, newDescription },
) => {
  const t = await sequelize.transaction();

  try {
    const deposit = await Deposit.findByPk(depositId);
    if (!deposit) throw new Error("El registro de depósito no existe.");

    const account = await Account.findByPk(deposit.accountId);
    if (!account)
      throw new Error("La cuenta asociada a este depósito no existe.");

    if (account.status === false) {
      throw new Error(
        "No se puede editar depósitos de una cuenta deshabilitada.",
      );
    }

    const oldAmount = parseFloat(deposit.amount);
    const updatedAmount = parseFloat(newAmount);

    const difference = updatedAmount - oldAmount;

    if (parseFloat(account.balance) + difference < 0) {
      throw new Error(
        "El ajuste dejaría la cuenta con saldo negativo. Operación cancelada.",
      );
    }

    account.balance = parseFloat(account.balance) + difference;
    await account.save({ transaction: t });

    deposit.amount = updatedAmount;
    deposit.description = newDescription || deposit.description;
    await deposit.save({ transaction: t });

    await t.commit();
    return { account, deposit };
  } catch (error) {
    if (t) await t.rollback();
    throw error;
  }
};
