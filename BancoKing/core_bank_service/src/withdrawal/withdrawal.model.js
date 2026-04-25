import { DataTypes } from "sequelize";
import { sequelize } from "../../configs/db.js";

export const Withdrawal = sequelize.define(
  "withdrawal",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    accountNumber: {
      type: DataTypes.STRING(15),
      allowNull: false,
      field: "account_number",
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  { timestamps: true },
);
