import axios from "axios";

export const validateUserExists = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const token = req.headers.authorization;

    if (!userId) return next();

    const authBase =
      process.env.AUTH_SERVICE_URL || "http://localhost:5288/api/v1";
    const dotnetUrl = `${authBase.replace(/\/$/, "")}/User/${userId}`;
    const response = await axios.get(dotnetUrl, {
      headers: { Authorization: token },
      timeout: 90000,
    });

    const userStatus = response.data?.status ?? response.data?.Status;

    if (!response.data || userStatus !== true) {
      return res.status(404).json({
        success: false,
        message:
          "El usuario no existe, está inactivo o no ha verificado su correo.",
      });
    }

    req.userFromDotNet = response.data;
    next();
  } catch (error) {
    const status = error.response?.status;
    const dotnetMessage =
      error.response?.data?.message ||
      error.response?.data?.title ||
      error.message;

    if (status === 404) {
      return res.status(404).json({
        success: false,
        message: "El usuario no existe en el sistema de autenticación.",
      });
    }

    return res.status(403).json({
      success: false,
      message:
        dotnetMessage || "Error al validar usuario en el servicio de autenticación.",
    });
  }
};
