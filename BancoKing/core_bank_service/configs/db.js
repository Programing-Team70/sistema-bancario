"use strict";

import { Sequelize } from "sequelize";
import { config } from "dotenv";

config();

console.log("--- Verificando Variables de Entorno ---");
console.log("DB:", process.env.DB_NAME);
console.log("User:", process.env.DB_USER);
console.log("Port:", process.env.DB_PORT);
console.log("---------------------------------------");

const useSsl = process.env.DB_SSL === "true";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
    timezone: "-06:00",
    define: {
      timestamps: true,
      underscored: true,
    },
    ...(useSsl && {
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    }),
  },
);

export const dbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL | Conexión exitosa.");

    await import("../src/account/account.model.js");
    await import("../src/deposits/deposit.model.js");

    await sequelize.sync({ alter: true });
    console.log("PostgreSQL | Tablas sincronizadas.");
  } catch (error) {
    console.error("PostgreSQL | Error:", error.message);
    process.exit(1);
  }
};
