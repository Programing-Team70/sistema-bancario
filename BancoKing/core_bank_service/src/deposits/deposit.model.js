import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';

export const Deposit = sequelize.define('Deposit', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    accountNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: 'Depósito en ventanilla'
    }
}, { 
    timestamps: true // createdAt, para los 60s
});