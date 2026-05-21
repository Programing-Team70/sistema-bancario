import { Router } from "express";
import {
  createAccount,
  disableAccount,
  availableAccount,
  getMyStatement,
  getAdminStatement,
  getGeneralMovements,
  getAccountSummary,
  getAllAccounts,
  getAllMyAccounts,
} from "./account.controller.js";
import { validateJWT, isAdmin } from "../../middlewares/validate-JWT.js";
import {
  validateCreateAccount,
  validateAccountNumberBody,
} from "../../middlewares/account-validator.js";
import { validateUserExists } from "../../middlewares/validate-user.js";
import { checkValidators } from "../../middlewares/check-validators.js";

const router = Router();

/**
 * @swagger
 * tags:
 *     name: Account
 *     description: Gestión de Cuentas
 */

/**
 * @swagger
 * /api/accounts/:
 *   post:
 *     summary: Crear una nueva cuenta bancaria (Solo Admin)
 *     tags: [Account]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountPost'
 *     responses:
 *       201:
 *         description: Cuenta creada con éxito
 *       500:
 *         description: Error interno del servidor
 */
router.post(
  "/",
  [
    validateJWT,
    isAdmin,
    validateCreateAccount,
    validateUserExists,
    checkValidators,
  ],
  createAccount,
);

/**
 * @swagger
 * /api/accounts/disable:
 *   patch:
 *     summary: Deshabilitar una cuenta bancaria (Solo Admin)
 *     tags: [Account Admin]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountPath'
 *     responses:
 *       200:
 *         description: La cuenta ha sido deshabilitada correctamente
 *       400:
 *         description: Error en la solicitud (Cuenta no existe o ya está deshabilitada)
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       403:
 *         description: Prohibido (El usuario no tiene permisos de Administrador)
 */
router.patch(
  "/disable",
  [validateJWT, isAdmin, validateAccountNumberBody, checkValidators],
  disableAccount,
);

/**
 * @swagger
 * /api/accounts/enable:
 *   patch:
 *     summary: Habilitar una cuenta bancaria (Solo Admin)
 *     tags: [Account Admin]
 *     security:
 *     - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AccountPath'
 *     responses:
 *       200:
 *         description: La cuenta ha sido Habilitada correctamente
 *       400:
 *         description: Error en la solicitud (Cuenta no existe o ya está Habilitada)
 *       401:
 *         description: No autorizado (Token faltante o inválido)
 *       403:
 *         description: Prohibido (El usuario no tiene permisos de Administrador)
 */
router.patch(
  "/enable",
  [validateJWT, isAdmin, validateAccountNumberBody, checkValidators],
  availableAccount,
);

/**
 * @swagger
 * /api/accounts/statement/{id}:
 *   get:
 *     summary: Obtener estado de cuenta detallado del usuario
 *     description: Retorna el balance actual y el historial completo de movimientos (depósitos, retiros y transferencias). Permite convertir los montos a otra moneda mediante el query parameter.
 *     tags: [Account Queries]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: ID único de la cuenta (PK)
 *     - in: query
 *       name: currency
 *       required: false
 *       schema:
 *         type: string
 *         default: GTQ
 *         description: Código de moneda para conversión (ej. USD, EUR, MXN)
 *     responses:
 *       200:
 *         description: Estado de cuenta generado exitosamente
 *       403:
 *         description: Acceso denegado - La cuenta no pertenece al usuario autenticado
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/statement/:id", [validateJWT], getMyStatement);

/**
 * @swagger
 * /api/accounts/admin/all-movements:
 *   get:
 *     summary: Obtener historial global de movimientos (Solo Admin)
 *     description: Retorna una lista consolidada de todos los depósitos, retiros y transferencias realizados en el sistema. Requiere permisos de administrador.
 *     tags: [Account Admin]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: query
 *       name: order
 *       schema:
 *         type: string
 *         enum: [ASC, DESC]
 *         default: DESC
 *         description: Ordenar los movimientos por fecha de forma ascendente o descendente.
 *     responses:
 *       200:
 *         description: Lista de movimientos obtenida exitosamente.
 *       401:
 *         description: No autorizado - Token faltante o inválido.
 *       403:
 *         description: Prohibido - Se requiere rol de ADMINISTRADOR.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/admin/all-movements", [validateJWT, isAdmin], getGeneralMovements);

/**
 * @swagger
 * /api/accounts/admin/statement/{id}:
 *   get:
 *     summary: Consultar estado de cuenta de cualquier usuario (Solo Admin)
 *     description: Permite a un administrador ver el historial completo de movimientos de cualquier cuenta mediante su ID, con opción de ordenar los resultados.
 *     tags: [Account Admin]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: ID único de la cuenta a consultar
 *     - in: query
 *       name: order
 *       required: false
 *       schema:
 *         type: string
 *         enum: [ASC, DESC]
 *         default: DESC
 *         description: Ordenar movimientos por monto (según la lógica del servicio) o fecha.
 *     responses:
 *       200:
 *         description: Estado de cuenta obtenido exitosamente por el administrador.
 *       403:
 *         description: Prohibido - El usuario no tiene rol de administrador.
 *       404:
 *         description: La cuenta solicitada no existe.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/admin/statement/:id", [validateJWT, isAdmin], getAdminStatement);

/**
 * @swagger
 * /api/accounts/summary/{id}:
 *   get:
 *     summary: Obtener resumen de cuenta (Vista rápida)
 *     description: Retorna información básica de la cuenta, incluyendo el número de cuenta enmascarado (oculto) por seguridad y el balance actual.
 *     tags: [Account Queries]
 *     security:
 *     - bearerAuth: []
 *     parameters:
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         description: ID único de la cuenta (UUID)
 *     responses:
 *       200:
 *         description: Resumen obtenido exitosamente.
 *       403:
 *         description: Acceso denegado - La cuenta no pertenece al usuario.
 *       404:
 *         description: Cuenta no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/summary/:id", [validateJWT], getAccountSummary);

/**
 * @swagger
 * /api/accounts/admin/all:
 *   get:
 *     summary: Obtener el listado de todas las cuentas bancarias (Solo Admin)
 *     description: Retorna una lista completa de todas las cuentas registradas en el sistema. Requiere permisos de administrador.
 *     tags: [Account Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *         description: Ordenar las cuentas por fecha de creación de forma ascendente o descendente.
 *     responses:
 *       200:
 *         description: Lista de cuentas obtenida exitosamente.
 *       401:
 *         description: No autorizado - Token faltante o inválido.
 *       403:
 *         description: Prohibido - Se requiere rol de ADMINISTRADOR.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/admin/all", [validateJWT, isAdmin], getAllAccounts);

/**
 * @swagger
 * /api/accounts/my-accounts:
 *   get:
 *     summary: Obtener todas las cuentas del usuario logueado
 *     description: Retorna únicamente la lista de cuentas que pertenecen al token enviado.
 *     tags: [Account Queries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: Lista de tus cuentas obtenida exitosamente.
 *       401:
 *         description: Token no válido o no proporcionado.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/my-accounts", [validateJWT], getAllMyAccounts);

export default router;
