import axios from "axios";

export const validateUserExists = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const token = req.headers.authorization;

    if (!userId) return next();

    const dotnetUrl = `http://localhost:5288/api/v1/user/${userId}`;
    const response = await axios.get(dotnetUrl, {
      headers: { Authorization: token },
    });

    if (!response.data || response.data.status !== true) {
      return res.status(404).json({
        success: false,
        message: "El usuario no existe o está inactivo en el sistema central.",
      });
    }

    req.userFromDotNet = response.data;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Error al validar usuario en .NET",
      error: error.response?.data?.message || error.message,
    });
  }
};
