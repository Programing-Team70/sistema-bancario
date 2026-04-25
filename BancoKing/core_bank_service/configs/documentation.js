import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Core_Bank_Service API",
      version: "1.0.0",
      description:
        "Documentación de servicios para la gestión de Cuentas Bancarias, Estados de Cuenta y Movimientos.",
      contact: {
        name: "Programming Team",
        email: "programingteam70@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
        description: "Servidor Local",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        AccountPost: {
          type: "object",
          required: ["userId", "type"],
          properties: {
            userId: {
              type: "string",
              description: "ID único del usuario",
            },
            type: {
              type: "string",
              enum: ["Ahorro", "Monetaria"],
              example: "Ahorro o Monetario",
              description: "Tipo de cuenta a crear",
            },
          },
        },
        AccountPath: {
          type: "object",
          required: ["accountNumber"],
          properties: {
            accountNumber: {
              type: "string",
              description: "0000 0000 00 00",
              example: "0000 0000 00 00",
            },
          },
        },
        DepositPost: {
          type: "object",
          required: ["accountNumber", "amount"],
          properties: {
            accountNumber: {
              type: "string",
              description: "El número de cuenta formateado (12 dígitos)",
              example: "0000 0000 00 00",
            },
            amount: {
              type: "number",
              format: "float",
              description: "Monto total a depositar",
              example: 3000.0,
            },
            description: {
              type: "string",
              description: "Motivo o concepto del depósito",
              example: "Depósito de casa",
            },
          },
        },
        DepositUpdate: {
          type: "object",
          properties: {
            amount: {
              type: "number",
              format: "float",
              description: "Nuevo monto para corregir el depósito original",
              example: 500.0,
            },
            description: {
              type: "string",
              description: "Nueva descripción detallando la corrección",
              example: "Corrección de monto: Depósito en efectivo",
            },
          },
        },
        TransferPost: {
          type: "object",
          required: ["senderAccountNumber", "receiverAccountNumber", "amount"],
          properties: {
            senderAccountNumber: {
              type: "string",
              description: "Número de cuenta de quien envía el dinero",
              example: "0000 0000 00 00",
            },
            receiverAccountNumber: {
              type: "string",
              description: "Número de cuenta de quien recibe el dinero",
              example: "0000 0000 00 00",
            },
            amount: {
              type: "number",
              format: "float",
              description: "Monto a transferir",
              example: 2100.0,
            },
            description: {
              type: "string",
              description: "Concepto opcional de la transferencia",
              example: "Pago de servicios",
            },
          },
        },
        WithdrawalPost: {
          type: "object",
          required: ["accountNumber", "amount"],
          properties: {
            accountNumber: {
              type: "string",
              description: "Número de cuenta desde donde se retira el efectivo",
              example: "0000 0000 00 00",
            },
            amount: {
              type: "number",
              format: "float",
              description: "Monto a retirar",
              example: 500.0,
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Account",
        description: "Operaciones de creación y estado de cuentas",
      },
      {
        name: "Account Admin",
        description: "Operaciones administrativas y reportes globales",
      },
      {
        name: "Account Queries",
        description: "Consultas de estados de cuenta y resúmenes para clientes",
      },
      {
        name: "Deposits",
        description: "Administración de depósitos monetarios",
      },
      {
        name: "Transfers",
        description: "Operaciones de envío de dinero entre cuentas",
      },
      {
        name: "Withdrawals",
        description: "Operaciones de retiro de efectivo (Solo Admin)",
      },
    ],
  },
  apis: [path.join(__dirname, "../src/**/*.js")],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
export { swaggerDocs, swaggerUi };
