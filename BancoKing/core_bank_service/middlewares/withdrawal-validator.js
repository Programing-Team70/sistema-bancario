import { body } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateWithdrawal = [
  body("accountNumber")
    .notEmpty()
    .withMessage("El número de cuenta es obligatorio")
    .matches(/^\d{4} \d{4} \d{2} \d{2}$/)
    .withMessage("Formato inválido (0000 0000 00 00)"),
  body("amount")
    .notEmpty()
    .withMessage("El monto es requerido")
    .isFloat({ gt: 0 })
    .withMessage("El monto debe ser mayor a 0"),
  checkValidators,
];
