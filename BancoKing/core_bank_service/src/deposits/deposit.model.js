import { DataTypes } from "sequelize";
import { sequelize } from "../../configs/db.js";

export const Deposit = sequelize.define(
  "Deposit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "account_id",
    },
    amount: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      defaultValue: "Depósito en efectivo",
    },
  },
  {
    tableName: "deposits",
    timestamps: true,
  },
);
