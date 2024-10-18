const { z } = require("zod");
const { RoleEnum } = require("../../access-control/role");

const createPrincipalSchema = z.object({
  principalName: z.string(),
  roles: RoleEnum.array().min(1),
});

const genNewAccessTokenSchema = z.object({
  refreshToken: z.string(),
});

module.exports = { createPrincipalSchema, genNewAccessTokenSchema };
