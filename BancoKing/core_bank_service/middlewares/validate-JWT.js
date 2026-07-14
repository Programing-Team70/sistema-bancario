"use strict";

import jwt from "jsonwebtoken";
import { jwtConfig } from "../configs/jwt.js";

export const validateJWT = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).send({ message: "No se proporcionó un token" });
    }

    token = token.replace(/^Bearer\s+/i, "");

    const decoded = jwt.verify(token, jwtConfig.secret, {
      algorithms: ["HS256"],
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience,
    });

    req.user = {
      uid: decoded.sub || decoded.uid || decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
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
