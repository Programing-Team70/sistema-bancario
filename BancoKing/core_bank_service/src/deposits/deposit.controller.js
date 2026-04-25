import * as DepositService from "./deposit.service.js";

export const createDeposit = async (req, res) => {
  try {
    const { accountNumber, amount, description } = req.body;

    const result = await DepositService.makeDeposit({
      accountNumber,
      amount,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Depósito realizado con éxito",
      newBalance: result.account.balance,
      status: result.account.status ? "Cuenta Activa" : "Cuenta Inactiva",
      details: result.deposit,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, description } = req.body;

    const result = await DepositService.updateDepositRecord(id, {
      newAmount: amount,
      newDescription: description,
    });

    return res.status(200).json({
      success: true,
      message: "Depósito actualizado y saldo de cuenta ajustado",
      updatedData: {
        newBalance: result.account.balance,
        amount: result.deposit.amount,
        description: result.deposit.description,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error al actualizar el depósito",
      error: error.message,
    });
  }
};
