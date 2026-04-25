import { Router } from "express";
import { createWithdrawal } from "./withdrawal.controller.js";
import { validateWithdrawal } from "../../middlewares/withdrawal-validator.js";
import { validateJWT, isAdmin } from "../../middlewares/validate-JWT.js";

const router = Router();

/**
 * @swagger
 * tags:
 *     name: Withdrawals
 *     description: Gestión de retiros de efectivo (Ventanilla/Cajero)
 */

/**
 * @swagger
 * /api/withdrawals/:
 *   post:
 *     summary: Registrar un nuevo retiro (Solo Admin)
 *     description: >
 *       Permite a un administrador registrar un retiro de efectivo.
 *       El sistema valida que la cuenta esté activa y que tenga saldo suficiente.
 *     tags: [Withdrawals]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawalPost'
 *     responses:
 *       201:
 *         description: Retiro procesado con éxito.
 *       400:
 *         description: Error en la operación (Saldo insuficiente o cuenta inactiva).
 *       403:
 *         description: Prohibido - Se requieren permisos de administrador.
 */
router.post("/", [validateJWT, isAdmin, validateWithdrawal], createWithdrawal);

export default router;
