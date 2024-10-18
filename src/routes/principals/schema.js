const { z } = require("zod");
const { RoleEnum } = require("../../access-control/role");

const createPrincipalSchema = z.object({
  jwtSecret: z.string(),
  principalName: z.string(),
  roles: RoleEnum.array().min(1),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

module.exports = { createPrincipalSchema, refreshTokenSchema };
