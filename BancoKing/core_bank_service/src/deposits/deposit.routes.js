import { Router } from "express";
import { createDeposit, updateDeposit } from "./deposit.controller.js";
import { validateJWT, isAdmin } from "../../middlewares/validate-JWT.js";
import {
  validateDeposit,
  validateUpdateDeposit,
} from "../../middlewares/deposit-validator.js";
import { checkValidators } from "../../middlewares/check-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *     name: Deposits
 *     description: Gestión administrativa de depósitos monetarios
 */

/**
 * @swagger
 * /api/deposit/:
 *   post:
 *     summary: Registrar un nuevo depósito (Solo Admin)
 *     description: Realiza un abono a una cuenta mediante su número de cuenta. Si la cuenta es nueva (status inactivo), requiere un depósito mínimo de Q50.00 para activarla.
 *     tags: [Deposits]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositPost'
 *     responses:
 *       201:
 *         description: Depósito realizado con éxito.
 *       400:
 *         description: Error en la transacción (Saldo insuficiente para ajuste, cuenta inexistente o monto insuficiente para activación).
 *       403:
 *         description: No autorizado - Solo administradores pueden registrar depósitos.
 */
router.post(
  "/",
  [validateJWT, isAdmin, validateDeposit, checkValidators],
  createDeposit,
);

/**
 * @swagger
 * /api/deposit/{id}:
 *   put:
 *     summary: Actualizar o corregir un depósito (Solo Admin)
 *     description: Permite modificar el monto o la descripción de un depósito existente. El sistema ajustará automáticamente el saldo de la cuenta relacionada basándose en la diferencia entre el monto viejo y el nuevo.
 *     tags: [Deposits]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: ID único del depósito (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositUpdate'
 *     responses:
 *       200:
 *         description: Depósito actualizado y saldo de cuenta ajustado con éxito.
 *       400:
 *         description: Error de validación (Ej. el ajuste dejaría la cuenta en saldo negativo).
 *       403:
 *         description: Prohibido - No tienes permisos de administrador.
 *       404:
 *         description: El registro de depósito o la cuenta asociada no existen.
 */
router.put(
  "/:id",
  [validateJWT, isAdmin, validateUpdateDeposit],
  updateDeposit,
);

export default router;
