import { Account } from "../account/account.model.js";
import { Withdrawal } from "./withdrawal.model.js";
import { sequelize } from "../../configs/db.js";

export const makeWithdrawal = async ({ accountNumber, amount }) => {
  const t = await sequelize.transaction();

  try {
    const account = await Account.findOne({ where: { accountNumber } });
    if (!account) throw new Error("La cuenta no existe.");

    if (!account.status) {
      throw new Error("No se pueden realizar retiros de una cuenta inactiva.");
    }

    const withdrawalAmount = parseFloat(amount);

    if (parseFloat(account.balance) < withdrawalAmount) {
      throw new Error("Saldo insuficiente para realizar el retiro.");
    }

    account.balance = parseFloat(account.balance) - withdrawalAmount;
    await account.save({ transaction: t });

    const withdrawal = await Withdrawal.create(
      {
        accountNumber,
        amount: withdrawalAmount,
      },
      { transaction: t },
    );

    await t.commit();
    return { account, withdrawal };
  } catch (error) {
    if (t) await t.rollback();
    throw error;
  }
};
