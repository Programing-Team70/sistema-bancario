"use strict";

const DEFAULT_SECRET = "$ecretKeyForKingProgramingTeam70";

export const jwtConfig = {
  secret: (process.env.SECRET_KEY || DEFAULT_SECRET).trim(),
  issuer: (process.env.JWT_ISSUER || "BancoKing").trim(),
  audience: (process.env.JWT_AUDIENCE || "BancoKing").trim(),
};
