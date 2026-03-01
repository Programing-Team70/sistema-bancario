import { Deposit } from './deposit.model.js';
import { Account } from '../account/account.model.js';

export const makeDeposit = async (req, res) => {
    try {
        const { accountNumber, amount, description } = req.body;

        const account = await Account.findOne({ where: { accountNumber } });
        if (!account) return res.status(404).json({ message: "Cuenta no encontrada" });

        // Crear el registro del depósito
        const deposit = await Deposit.create({ accountNumber, amount, description });

        // Lógica de Activación y Suma
        const currentBalance = Number(account.balance);
        const depositAmount = Number(amount);

        account.balance = currentBalance + depositAmount;

        // Si el saldo llega a 50 o más, activamos
        if (account.balance >= 50) {
            account.status = true;
        }
        await account.save();

        res.status(201).json({
            message: "Depósito realizado y cuenta actualizada",
            deposit,
            newBalance: account.balance,
            active: account.status
        });
    } catch (error) {
        res.status(500).json({ message: "Error al depositar", error: error.message });
    }
};

export const updateDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        const { newAmount } = req.body;

        const deposit = await Deposit.findByPk(id);
        if (!deposit) return res.status(404).json({ message: "Depósito no encontrado" });

        // VALIDACIÓN DE 60 SEGUNDOS
        const now = new Date();
        const created = new Date(deposit.createdAt);
        const diffInSeconds = (now - created) / 1000;

        if (diffInSeconds > 60) {
            return res.status(403).json({ message: "Tiempo límite de 60s expirado. No se puede editar." });
        }

        // Actualizar saldo de la cuenta (Restar anterior, sumar nuevo)
        const account = await Account.findOne({ where: { accountNumber: deposit.accountNumber } });
        account.balance = (parseFloat(account.balance) - parseFloat(deposit.amount)) + parseFloat(newAmount);
        await account.save();

        // Actualizar registro
        deposit.amount = newAmount;
        await deposit.save();

        res.json({ message: "Depósito actualizado", deposit, newBalance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};

export const reverseDeposit = async (req, res) => {
    try {
        const { id } = req.params;
        const deposit = await Deposit.findByPk(id);

        if (!deposit) return res.status(404).json({ message: "Depósito no encontrado" });

        // VALIDACIÓN DE 60 SEGUNDOS
        const diffInSeconds = (new Date() - new Date(deposit.createdAt)) / 1000;
        if (diffInSeconds > 60) {
            return res.status(403).json({ message: "Ya pasaron 60s, no se puede revertir." });
        }

        // Restar el monto del saldo de la cuenta
        const account = await Account.findOne({ where: { accountNumber: deposit.accountNumber } });
        account.balance = parseFloat(account.balance) - parseFloat(deposit.amount);
        await account.save();

        // Eliminar registro del depósito
        await deposit.destroy();

        res.json({ message: "Depósito revertido con éxito", newBalance: account.balance });
    } catch (error) {
        res.status(500).json({ message: "Error al revertir", error: error.message });
    }
};