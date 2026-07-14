"use strict";

import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.js";

const verifyOptions = {
  algorithms: ["HS256"],
  issuer: jwtConfig.issuer,
  audience: jwtConfig.audience,
};

const verifyWithSecrets = (token) => {
  let lastError = null;

  for (const secret of jwtConfig.secrets) {
    try {
      return jwt.verify(token, secret, verifyOptions);
    } catch (err) {
      lastError = err;
    }

    try {
      return jwt.verify(token, secret, { algorithms: ["HS256"] });
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError;
};

export const validateJWT = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: "No se proporcionó un token" });
    }

    token = token.replace(/^Bearer\s+/i, "");

    const decoded = verifyWithSecrets(token);

    req.user = {
      uid: decoded.sub || decoded.uid || decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err?.name === "TokenExpiredError") {
      return res.status(401).send({ message: "Token expirado. Inicia sesión de nuevo." });
    }
    return res.status(401).send({ message: "Token no válido" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN_ROLE") {
    next();
  } else {
    return res
      .status(403)
      .send({ message: "Acceso denegado. Se requiere rol de Administrador" });
  }
};
