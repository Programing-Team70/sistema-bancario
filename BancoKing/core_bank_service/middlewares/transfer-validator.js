import { body } from "express-validator";
import { checkValidators } from "./check-validators.js";

export const validateTransfer = [
  body("senderAccountNumber")
    .notEmpty()
    .withMessage("La cuenta de origen es requerida")
    .matches(/^\d{4} \d{4} \d{2} \d{2}$/)
    .withMessage("Formato de cuenta de origen inválido (0000 0000 00 00)"),
  body("receiverAccountNumber")
    .notEmpty()
    .withMessage("La cuenta de destino es requerida")
    .matches(/^\d{4} \d{4} \d{2} \d{2}$/)
    .withMessage("Formato de cuenta de destino inválido (0000 0000 00 00)"),
  body("amount")
    .notEmpty()
    .withMessage("El monto es obligatorio")
    .isFloat({ gt: 0 })
    .withMessage("El monto debe ser un número mayor a 0"),
  checkValidators,
];
