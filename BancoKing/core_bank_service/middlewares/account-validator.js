import { body, param } from "express-validator";
import { validateJWT } from "./validate-JWT.js";
import { checkValidators } from "./check-validators.js";

export const validateCreateAccount = [
  body("userId")
    .notEmpty()
    .withMessage("El UUID del usuario es requerido")
    .isLength({ max: 20 })
    .withMessage("El ID de usuario no puede exceder los 20 caracteres"),
  body("type")
    .notEmpty()
    .withMessage("El tipo de cuenta es requerido")
    .isIn(["Monetaria", "Ahorro"])
    .withMessage("Tipo de cuenta no válido. Debe ser Monetaria o Ahorro"),
  checkValidators,
];

export const validateAccountNumberBody = [
  body("accountNumber")
    .notEmpty()
    .withMessage("El número de cuenta es requerido en el cuerpo de la petición")
    .matches(/^\d{4} \d{4} \d{2} \d{2}$/)
    .withMessage("El formato del número de cuenta debe ser '0000 0000 00 00'"),
  checkValidators,
];

export const validateTopMovements = [
  body("order")
    .optional()
    .toUpperCase()
    .isIn(["ASC", "DESC"])
    .withMessage("El orden debe ser ASC o DESC"),
  checkValidators,
];
