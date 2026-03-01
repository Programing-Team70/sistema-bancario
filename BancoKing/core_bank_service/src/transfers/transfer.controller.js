import { Transfer } from './transfer.model.js';
import { Account } from '../account/account.model.js';
import { Op } from 'sequelize';

export const makeTransfer = async (req, res) => {
    try {
        const { senderAccountNumber, receiverAccountNumber, amount } = req.body;
        const transferAmount = parseFloat(amount);

        // No transferir a la misma cuenta
        if (senderAccountNumber === receiverAccountNumber) {
            return res.status(400).json({ message: "No puedes realizar una transferencia a la misma cuenta." });
        }

        // Límites por movimiento (Q2000)
        if (transferAmount > 2000) {
            return res.status(400).json({ message: "El monto máximo por transferencia es de Q2000.00" });
        }

        // Buscar cuentas
        const sender = await Account.findOne({ where: { accountNumber: senderAccountNumber } });
        const receiver = await Account.findOne({ where: { accountNumber: receiverAccountNumber } });

        if (!sender || !receiver) {
            return res.status(404).json({ message: "Una o ambas cuentas no existen" });
        }

        const tokenID = String(req.user.uid).trim().toLowerCase();

        const dbOwnerID = String(sender.userId || "").trim().toLowerCase();
        const userRole = req.user.role;

        const isOwner = tokenID === dbOwnerID;
        const isAdmin = userRole === 'ADMIN_ROLE';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                message: "Acceso denegado. No eres el propietario de esta cuenta.",
                debug: { token: tokenID, owner: dbOwnerID }
            });
        }
        if (!sender.status) {
            return res.status(400).json({ message: "La cuenta de origen está inactiva." });
        }

        if (parseFloat(sender.balance) < transferAmount) {
            return res.status(400).json({ message: "Saldo insuficiente para realizar la transferencia." });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const dailyTotal = await Transfer.sum('amount', {
            where: {
                senderAccountNumber,
                createdAt: { [Op.gte]: startOfDay }
            }
        }) || 0;

        if ((parseFloat(dailyTotal) + transferAmount) > 10000) {
            return res.status(400).json({ message: "Límite diario excedido (Máximo Q10,000.00)." });
        }

        sender.balance = parseFloat(sender.balance) - transferAmount;
        receiver.balance = parseFloat(receiver.balance) + transferAmount;

        if (parseFloat(receiver.balance) >= 50) {
            receiver.status = true;
        }

        await sender.save();
        await receiver.save();

        const transferRecord = await Transfer.create({
            senderAccountNumber,
            receiverAccountNumber,
            amount: transferAmount
        });

        res.status(201).json({
            message: "Transferencia exitosa",
            nuevoSaldoEmisor: sender.balance,
            transferId: transferRecord.id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno", error: error.message });
    }
};