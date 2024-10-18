const { z } = require("zod");

// const booleanParamSchema = z.enum(["true", "false"]).transform((value) => value === "true");

const appEnvSchema = z.object({
  APP_NAME: z.string().default("FileServer"),
  TIME_ZONE: z.string().default("Asia/Ho_Chi_Minh"),
  PORT: z.coerce.number().int().default(8000),
  REQUEST_SIZE_LIMIT_IN_MB: z.coerce.number().int().default(100),
  DISCORD_NOTIFY_URL: z.string().default(""),
  LOG_DB_CONNECTION_STRING: z.string().nullable().default(null),
  ACCESS_TOKEN_EXPIRE_TIME: z.string().or(z.number()).default("1d"),
  BASE_FOLDER_PATH: z.string().default("../storage"),
  MONGODB_CONNECT_STRING: z.string(),
  JWT_SECRET: z.string(),
});

const appEnv = appEnvSchema.parse(process.env);

module.exports = { appEnv };
