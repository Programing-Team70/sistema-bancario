import rateLimit from "express-rate-limit";

export const requestLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50,
  standardHeaders: true,
  handler: (req, res) => {
    console.warn(` Bloqueo por Rate Limit | IP: ${req.ip} | Ruta: ${req.path}`);
    res.status(429).json({
      success: false,
      message: "Demasiadas peticiones. Por seguridad, espera 15 minutos.",
      error: "RATE_LIMIT_EXCEEDED",
    });
  },
});
