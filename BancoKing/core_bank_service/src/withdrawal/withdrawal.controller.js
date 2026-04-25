import * as WithdrawalService from "./withdrawal.service.js";

export const createWithdrawal = async (req, res) => {
  try {
    const { accountNumber, amount } = req.body;

    const result = await WithdrawalService.makeWithdrawal({
      accountNumber,
      amount,
    });

    return res.status(201).json({
      success: true,
      message: "Retiro procesado con éxito",
      data: {
        account: result.account.accountNumber,
        withdrawalAmount: result.withdrawal.amount,
        newBalance: result.account.balance,
        date: result.withdrawal.createdAt,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error al procesar el retiro",
      error: error.message,
    });
  }
};
