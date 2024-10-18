const { z } = require("zod");

const Roles = {
  ADMIN: "ADMIN",
  READER: "READER",
  WRITER: "WRITER",
};

const RoleEnum = z.nativeEnum(Roles);

module.exports = { Roles, RoleEnum };
