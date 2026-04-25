import { Router } from "express";
import { createTransfer } from "./transfer.controller.js";
import { validateTransfer } from "../../middlewares/transfer-validator.js";
import { validateJWT } from "../../middlewares/validate-JWT.js";

const router = Router();

/**
 * @swagger
 * tags:
 *     name: Transfers
 *     description: Gestión de transferencias monetarias entre cuentas
 */

/**
 * @swagger
 * /api/transfers/:
 *   post:
 *     summary: Realizar una transferencia bancaria
 *     description: >
 *       Permite transferir fondos entre dos cuentas.
 *       Validaciones incluidas:
 *         - El usuario debe ser dueño de la cuenta de origen (o ser ADMIN).
 *         - Ambas cuentas deben estar activas.
 *         - Si la cuenta de origen es de tipo 'Ahorro', el monto máximo es Q2,000.00.
 *         - La cuenta debe tener saldo suficiente.
 *     tags: [Transfers]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferPost'
 *     responses:
 *       201:
 *         description: Transferencia realizada exitosamente.
 *       400:
 *         description: Error en la transacción (Saldo insuficiente, límite excedido o cuentas inactivas).
 *       401:
 *         description: No autorizado - Token JWT inválido o faltante.
 */
router.post("/", [validateJWT, validateTransfer], createTransfer);

export default router;
