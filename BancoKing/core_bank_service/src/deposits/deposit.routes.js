import { Router } from 'express';
import { makeDeposit, updateDeposit, reverseDeposit } from './deposit.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/', [validateJWT, isAdmin], makeDeposit);
router.put('/:id', [validateJWT, isAdmin], updateDeposit);
router.delete('/:id', [validateJWT, isAdmin], reverseDeposit);

export default router;