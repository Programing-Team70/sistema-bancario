'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './db.js';
import accountRoutes from '../src/account/account.routes.js';
import depositRoutes from '../src/deposits/deposit.routes.js';
import transferRoutes from '../src/transfers/transfer.routes.js';
import withdrawalRoutes from '../src/withdrawal/withdrawal.routes.js';

const app = express();

const configs = (app) => {
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));
};

const routes = (app) => {
    app.use('/api/accounts', accountRoutes);
    app.use('/api/deposit', depositRoutes);
    app.use('/api/transfer', transferRoutes);
    app.use('/api/withdrawal', withdrawalRoutes);

    app.get('/test', (req, res) => {
        res.send({ message: 'BancoKing Online', time: new Date().toLocaleString() });
    });
};

export const initServer = async () => {
    configs(app);
    routes(app);
    await dbConnection();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Servidor BancoKing corriendo en: ${port}`);
    });
};