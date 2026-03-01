import { Router } from 'express';
import { makeTransfer } from './transfer.controller.js';
import { validateJWT } from '../../middlewares/auth.middleware.js';

const router = Router();

// Aquí solo verifyToken
// Dueño o admin
router.post('/', [validateJWT], makeTransfer);

export default router;