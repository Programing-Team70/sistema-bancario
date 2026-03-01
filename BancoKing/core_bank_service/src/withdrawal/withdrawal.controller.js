import { Withdrawal } from './withdrawal.model.js';
import { Account } from '../account/account.model.js';

export const makeWithdrawal = async (req, res) => {
    try {
        const { accountNumber, amount, description } = req.body;
        const withdrawalAmount = parseFloat(amount);

        // Verificar que la cuenta existe
        const account = await Account.findOne({ where: { accountNumber } });
        if (!account) {
            return res.status(404).json({ message: "Cuenta no encontrada" });
        }

        // Validar que la cuenta esté activa
        if (!account.status) {
            return res.status(400).json({ message: "La cuenta está inactiva. No se pueden realizar retiros." });
        }

        // No puede retirar más de lo que tiene
        if (parseFloat(account.balance) < withdrawalAmount) {
            return res.status(400).json({
                message: "Saldo insuficiente.",
                saldoActual: account.balance,
                montoSolicitado: withdrawalAmount
            });
        }

        // Crear el registro del retiro 
        const withdrawal = await Withdrawal.create({
            accountNumber,
            amount: withdrawalAmount,
            description: description || 'Retiro de efectivo en ventanilla'
        });

        // Restar el saldo de la cuenta
        account.balance = parseFloat(account.balance) - withdrawalAmount;
        await account.save();

        res.status(201).json({
            message: "Retiro procesado exitosamente.",
            detalle: withdrawal,
            nuevoSaldo: account.balance
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al procesar el retiro", error: error.message });
    }
};