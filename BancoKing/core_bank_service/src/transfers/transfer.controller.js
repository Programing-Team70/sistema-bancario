import * as TransferService from "./transfer.service.js";

export const createTransfer = async (req, res) => {
  try {
    const { senderAccountNumber, receiverAccountNumber, amount, description } =
      req.body;

    const authenticatedUser = req.user;

    const result = await TransferService.makeTransfer({
      senderAccountNumber,
      receiverAccountNumber,
      amount,
      description,
      authenticatedUser,
    });

    return res.status(201).json({
      success: true,
      message: "Transferencia realizada exitosamente",
      data: {
        transactionId: result.transfer.id,
        amount: result.transfer.amount,
        from: result.transfer.senderAccountNumber,
        to: result.transfer.receiverAccountNumber,
        remainingBalance: result.newBalance,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "La transferencia no pudo procesarse",
      error: error.message,
    });
  }
};
