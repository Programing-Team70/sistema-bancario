import { body, param } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateDeposit = [
  body("accountNumber")
    .notEmpty()
    .withMessage("El número de cuenta es requerido")
    .isLength({ min: 10, max: 15 })
    .withMessage(
      "El número de cuenta debe tener entre y 15 caracteres ejemplo (0000 0000 00 00)",
    ),
  body("amount")
    .notEmpty()
    .withMessage("El monto es requerido")
    .isFloat({ gt: 0 })
    .withMessage("El monto debe ser un número mayor a 0"),
  body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La descripción no puede exceder los 100 caracteres"),
  checkValidators,
];

export const validateUpdateDeposit = [
  param("id")
    .notEmpty()
    .withMessage("El ID del depósito es requerido")
    .isUUID()
    .withMessage("El ID del depósito no es un formato válido (UUID)"),

  body("amount")
    .notEmpty()
    .withMessage("El monto es requerido para la actualización")
    .isFloat({ gt: 0 })
    .withMessage("El monto debe ser un número mayor a 0"),

  body("description")
    .optional()
    .isLength({ max: 100 })
    .withMessage("La descripción no puede exceder los 100 caracteres"),

  checkValidators,
];
