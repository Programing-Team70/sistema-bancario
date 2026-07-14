"use strict";

const DEFAULT_SECRET = "$ecretKeyForKingProgramingTeam70";

const uniqueSecrets = (values) =>
  [...new Set(values.filter((value) => typeof value === "string" && value.length > 0))];

export const jwtConfig = {
  secrets: uniqueSecrets([process.env.SECRET_KEY, DEFAULT_SECRET].map((value) => value?.trim())),
  issuer: (process.env.JWT_ISSUER || "BancoKing").trim(),
  audience: (process.env.JWT_AUDIENCE || "BancoKing").trim(),
};
