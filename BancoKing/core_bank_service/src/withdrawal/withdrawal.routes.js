import { Router } from 'express';
import { makeWithdrawal } from './withdrawal.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', [validateJWT, isAdmin], makeWithdrawal);

export default router;