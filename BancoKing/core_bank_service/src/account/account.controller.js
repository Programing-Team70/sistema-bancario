import * as AccountService from './account.service.js';
import { Account } from './account.model.js';
import { convertCurrency } from '../../utils/currency.services.js';
import { sequelize } from '../../configs/db.js';
import { Deposit } from '../deposits/deposit.model.js';
import { Transfer } from '../transfers/transfer.model.js';
import { Withdrawal } from '../withdrawal/withdrawal.model.js';
import { Op } from 'sequelize';

export const createAccount = async (req, res) => {
    try {
        const { userId } = req.body;
        const token = req.headers.authorization; // Token del Admin que viene de Postman

        if (!userId) return res.status(400).json({ message: 'El UUID del usuario es requerido.' });

        // Generar número de cuenta aleatorio
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        const newAccount = await AccountService.register({
            userId,
            accountNumber,
            balance: 0,
            status: false
        }, token);

        return res.status(201).json({
            message: 'Cuenta creada y vinculada a .NET exitosamente.',
            account: newAccount
        });
    } catch (error) {
        return res.status(403).json({
            message: 'No se pudo crear la cuenta bancaria.',
            error: error.message
        });
    }
};

export const getAccounts = async (req, res) => {
    try {
        const { accountNumber } = req.params;

        const account = await Account.findOne({ where: { accountNumber } });

        if (!account) {
            return res.status(404).json({ message: "La cuenta especificada no existe." });
        }

        const tokenID = String(req.user.uid).trim().toLowerCase();
        const dbOwnerID = String(account.userId || "").trim().toLowerCase();
        const userRole = req.user.role;

        const isOwner = tokenID === dbOwnerID;
        const isAdmin = userRole === 'ADMIN_ROLE';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Acceso denegado. No tienes permisos para ver esta cuenta."
            });
        }

        const balanceGTQ = parseFloat(account.balance);
        const conversion = await convertCurrency(balanceGTQ, 'GTQ', 'USD');

        res.status(200).json({
            accountInfo: {
                number: account.accountNumber,
                ownerId: account.userId,
                status: account.status ? "ACTIVA" : "INACTIVA (Requiere depósito inicial >= Q50)"
            },
            balances: {
                GTQ: balanceGTQ,
                USD: conversion ? conversion.convertedAmount : "Servicio de conversión no disponible",
                exchangeRate: conversion ? conversion.rate : "N/A"
            },
            currencyBase: "Quetzales (GTQ)",
            lastUpdate: new Date()
        });

    } catch (error) {
        console.error("Error en el controlador de cuentas:", error);
        res.status(500).json({
            message: "Error interno al consultar la cuenta",
            error: error.message
        });
    }
};

export const getAccountHistory = async (req, res) => {
    try {
        const { accountNumber } = req.params;
        const userRole = req.user.role;
        const tokenID = String(req.user.uid).trim().toLowerCase();

        const account = await Account.findOne({ where: { accountNumber } });
        if (!account) return res.status(404).json({ message: "Cuenta no encontrada" });

        if (tokenID !== String(account.userId).toLowerCase() && userRole !== 'ADMIN_ROLE') {
            return res.status(403).json({ message: "No tienes permiso para ver este historial" });
        }

        // Definir límite, si es Admin, solo 5. Si es usuario, todos.
        const limit = userRole === 'ADMIN_ROLE' ? 5 : null;

        // Buscar depósitos recibidos
        const deposits = await Deposit.findAll({
            where: { accountNumber },
            limit,
            order: [['createdAt', 'DESC']]
        });

        // Buscar transferencias
        const transfers = await Transfer.findAll({
            where: {
                [Op.or]: [{ senderAccountNumber: accountNumber }, { receiverAccountNumber: accountNumber }]
            },
            limit,
            order: [['createdAt', 'DESC']]
        });

        // Buscar Retiros
        const withdrawals = await Withdrawal.findAll({
            where: { accountNumber },
            limit,
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            accountBalance: account.balance,
            owner: account.userId,
            movements: {
                deposits,
                transfers,
                withdrawals
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial", error: error.message });
    }
};

export const getTopMovingAccounts = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN_ROLE') return res.status(403).json({ message: "Acceso denegado" });

        const { order = 'DESC' } = req.query;

        const validOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const accounts = await Account.findAll({
            attributes: [
                'accountNumber',
                'userId',
                [
                    sequelize.literal(`(
                        (SELECT COUNT(*) FROM "transfers" WHERE "transfers"."sender_account_number" = "Account"."account_number") +
                        (SELECT COUNT(*) FROM "withdrawals" WHERE "withdrawals"."account_number" = "Account"."account_number")
                    )`),
                    'totalMovements'
                ]
            ],
            order: [[sequelize.literal('"totalMovements"'), validOrder]],
            limit: 10
        });

        res.status(200).json(accounts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al generar reporte", error: error.message });
    }
};