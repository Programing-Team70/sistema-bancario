import { Account } from "../src/account/account.model.js";
import { Deposit } from "../src/deposits/deposit.model.js";

export const setupAssociations = () => {
  Deposit.belongsTo(Account, { foreignKey: "accountId" });

  Account.hasMany(Deposit, { foreignKey: "accountId" });

  console.log(" [BancoKing] Relaciones cargadas correctamente.");
};
