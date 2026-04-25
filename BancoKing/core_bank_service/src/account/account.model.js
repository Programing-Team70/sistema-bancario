import { DataTypes } from "sequelize";
import { sequelize } from "../../configs/db.js";

export const Account = sequelize.define(
  "Account",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(20),
      allowNull: false,
      field: "user_id",
    },
    accountNumber: {
      type: DataTypes.STRING(15),
      unique: true,
      allowNull: false,
      field: "account_number",
    },
    type: {
      type: DataTypes.ENUM("Monetaria", "Ahorro"),
      allowNull: false,
      defaultValue: "Ahorro",
      field: "account_type",
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0.0,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "GTQ",
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "status",
    },
  },
  {
    tableName: "accounts",
    timestamps: true,
  },
);
