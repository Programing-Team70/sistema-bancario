import { Router } from 'express';
import { createAccount, getAccounts, getAccountHistory, getTopMovingAccounts } from './account.controller.js';
import { validateJWT, isAdmin } from '../../middlewares/auth.middleware.js';

const api = Router();

api.post('/create', [validateJWT, isAdmin], createAccount);
api.get('/:accountNumber', [validateJWT], getAccounts);
api.get('/history/:accountNumber', [validateJWT], getAccountHistory);
api.get('/admin/top-movements', [validateJWT, isAdmin], getTopMovingAccounts);

export default api;