'use strict';

import jwt from 'jsonwebtoken';

export const validateJWT = (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) return res.status(401).send({ message: 'No se proporcionó un token' });

        token = token.replace(/^Bearer\s+/, "");
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = {
            uid: decoded.uid || decoded.id || decoded.sub,
            role: decoded.role
        };

        next();
    } catch (err) {
        return res.status(401).send({ message: 'Token no válido' });
    }
};

export const isAdmin = (req, res, next) => {
    // Verifica que el rol que viene de .NET sea exactamente ADMIN_ROLE
    if (req.user && req.user.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(403).send({ message: 'Acceso denegado. Se requiere rol de Administrador' });
    }
};