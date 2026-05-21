import * as AccountService from "./account.service.js";

export const createAccount = async (req, res) => {
  try {
    const { userId, type } = req.body;

    const newAccount = await AccountService.createAccountRecord({
      userId,
      type,
    });

    return res.status(201).json({
      success: true,
      message: "Cuenta bancaria generada exitosamente",
      account: {
        id: newAccount.id,
        userId: newAccount.userId,
        accountNumber: newAccount.accountNumber,
        type: newAccount.type,
        balance: newAccount.balance,
        status: newAccount.status
          ? "Activa"
          : "Inactiva (Pendiente de activación)",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno al crear la cuenta",
      error: error.message,
    });
  }
};

export const disableAccount = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    const accountDisabled = await AccountService.disableAccount(accountNumber);

    return res.status(200).json({
      success: true,
      message: "La cuenta ha sido deshabilitada correctamente",
      account: {
        accountNumber: accountDisabled.accountNumber,
        status: "Inactiva/Deshabilitada",
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "No se pudo deshabilitar la cuenta",
      error: error.message,
    });
  }
};

export const availableAccount = async (req, res) => {
  try {
    const { accountNumber } = req.body;

    const accountEnabled = await AccountService.availableAccount(accountNumber);

    return res.status(200).json({
      success: true,
      message: "La cuenta ha sido habilitada correctamente",
      account: {
        accountNumber: accountEnabled.accountNumber,
        status: "Activa/Habilitada",
        updatedAt: accountEnabled.updatedAt,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "No se pudo habilitar la cuenta",
      error: error.message,
    });
  }
};

export const getMyStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const { currency } = req.query;
    const authenticatedUser = req.user;

    const statement = await AccountService.getMyAccountStatement(id, {
      targetCurrency: currency || "GTQ",
      authenticatedUserId: authenticatedUser.uid,
    });

    return res.status(200).json({
      success: true,
      statement,
    });
  } catch (error) {
    const statusCode = error.message.includes("denegado")
      ? 403
      : error.message.includes("encontrada")
        ? 404
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGeneralMovements = async (req, res) => {
  try {
    const { order } = req.query;
    const movements = await AccountService.getAllBankMovements({
      order: order || "DESC",
    });

    return res.status(200).json({
      success: true,
      total: movements.length,
      movements,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminStatement = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.query;

    const statement = await AccountService.getAdminAccountStatement(id, {
      order: order || "DESC",
    });

    return res.status(200).json({
      success: true,
      statement,
    });
  } catch (error) {
    return res.status(error.message.includes("no existe") ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAccountSummary = async (req, res) => {
  try {
    const { id } = req.params;
    const authenticatedUser = req.user;

    const summary = await AccountService.getAccountSummary(
      id,
      authenticatedUser.uid,
    );

    return res.status(200).json({
      success: true,
      message: "Resumen de cuenta obtenido exitosamente",
      summary,
    });
  } catch (error) {
    const statusCode = error.message.includes("Acceso denegado")
      ? 403
      : error.message.includes("encontrada")
        ? 404
        : 500;

    return res.status(statusCode).json({
      success: false,
      message: error.message || "Error al obtener el resumen de la cuenta",
    });
  }
};

export const getAllAccounts = async (req, res) => {
  try {
    const { order } = req.query;

    const accounts = await AccountService.getAllAccounts({
      order: order || "DESC",
    });

    return res.status(200).json({
      success: true,
      total: accounts.length,
      accounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno al obtener las cuentas",
      error: error.message,
    });
  }
};

export const getAllMyAccounts = async (req, res) => {
  try {
    const { order } = req.query;
    const authenticatedUser = req.user;

    const accounts = await AccountService.getAccountsByUserId(
      authenticatedUser.uid,
      {
        order: order || "DESC",
      },
    );

    return res.status(200).json({
      success: true,
      total: accounts.length,
      accounts,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error interno al obtener tus cuentas bancarias",
      error: error.message,
    });
  }
};
