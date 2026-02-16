import Account from '../src/models/Account.js';

export const checkBalance = async (req, res, next) => {
    const { accountNumber, amount } = req.body;
    
    const account = await Account.findOne({ accountNumber });
    if (!account || account.balance < amount) {
        return res.status(400).json({ message: "Fondos insuficientes o cuenta no encontrada" });
    }
    
    req.account = account;
    next();
};