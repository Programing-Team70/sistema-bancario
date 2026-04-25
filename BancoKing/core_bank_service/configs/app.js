"use strict";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { swaggerDocs, swaggerUi } from "./documentation.js";
import { dbConnection } from "./db.js";
import { corsOptions } from "./configuration.js";
import { helmetOptions } from "./helmets.js";
import { requestLimit } from "./rateLimit.js";
import { setupAssociations } from "./associations.js";

// Importanción de Rutas
import accountRoutes from "../src/account/account.routes.js";
import depositRoutes from "../src/deposits/deposit.routes.js";
import transferRoutes from "../src/transfers/transfer.routes.js";
import withdrawalRoutes from "../src/withdrawal/withdrawal.routes.js";

const app = express();

const configs = (app) => {
  app.use(helmet(helmetOptions));
  app.use(cors(corsOptions));
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: false }));
  app.use(morgan("dev"));
  app.use(requestLimit);
};

const routes = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
  app.use("/api/accounts", accountRoutes);
  app.use("/api/deposit", depositRoutes);
  app.use("/api/transfers", transferRoutes);
  app.use("/api/withdrawals", withdrawalRoutes);

  app.get("/test", (req, res) => {
    res.send({
      message: "BancoKing Online - Sistema Seguro",
      time: new Date().toLocaleString(),
    });
  });

  // Manejador de rutas inexistentes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Recurso no encontrado en BancoKing.",
    });
  });
};

export const initServer = async () => {
  app.set("trust proxy", 1);

  try {
    configs(app);
    setupAssociations();
    await dbConnection();
    routes(app);

    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(` Servidor BancoKing ejecutándose en: ${port} `);
    });
  } catch (error) {
    console.error(` Fallo al iniciar BancoKing: ${error.message} `);
    process.exit(1);
  }
};
