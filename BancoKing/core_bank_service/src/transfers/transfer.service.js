import { Account } from "../account/account.model.js";
import { Transfer } from "./transfer.model.js";
import { sequelize } from "../../configs/db.js";

export const makeTransfer = async ({
  senderAccountNumber,
  receiverAccountNumber,
  amount,
  description,
  authenticatedUser,
}) => {
  const t = await sequelize.transaction();

  try {
    if (!authenticatedUser) {
      throw new Error("No se encontró información del usuario autenticado.");
    }

    const senderAccount = await Account.findOne({
      where: { accountNumber: senderAccountNumber },
    });
    const receiverAccount = await Account.findOne({
      where: { accountNumber: receiverAccountNumber },
    });

    if (!senderAccount) throw new Error("La cuenta de origen no existe.");
    if (!receiverAccount) throw new Error("La cuenta de destino no existe.");

    if (
      authenticatedUser.role !== "ADMIN_ROLE" &&
      senderAccount.userId !== authenticatedUser.uid
    ) {
      throw new Error(
        "No tienes permiso para realizar transferencias desde una cuenta que no te pertenece.",
      );
    }

    if (senderAccountNumber === receiverAccountNumber)
      throw new Error("No puedes transferir a la misma cuenta.");

    if (!senderAccount.status || !receiverAccount.status) {
      throw new Error(
        "Una de las cuentas involucradas está inactiva o deshabilitada.",
      );
    }

    const transferAmount = parseFloat(amount);

    if (senderAccount.type === "Ahorro" && transferAmount > 2000) {
      throw new Error(
        "Las cuentas de ahorro tienen un límite de Q2,000.00 por transferencia.",
      );
    }

    if (parseFloat(senderAccount.balance) < transferAmount) {
      throw new Error("Saldo insuficiente para realizar la transferencia.");
    }

    senderAccount.balance = parseFloat(senderAccount.balance) - transferAmount;
    await senderAccount.save({ transaction: t });

    receiverAccount.balance =
      parseFloat(receiverAccount.balance) + transferAmount;
    await receiverAccount.save({ transaction: t });

    const transfer = await Transfer.create(
      {
        senderAccountNumber,
        receiverAccountNumber,
        amount: transferAmount,
        description: description || "Transferencia bancaria",
      },
      { transaction: t },
    );

    await t.commit();
    return { transfer, newBalance: senderAccount.balance };
  } catch (error) {
    if (t) await t.rollback();
    throw error;
  }
};
