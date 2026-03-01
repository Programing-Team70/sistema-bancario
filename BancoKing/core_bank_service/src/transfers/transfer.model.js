import { DataTypes } from 'sequelize';
import { sequelize } from '../../configs/db.js';

export const Transfer = sequelize.define('Transfer', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    senderAccountNumber: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    receiverAccountNumber: {
        type: DataTypes.STRING(15),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        defaultValue: 'Transferencia entre cuentas'
    }
});