const { appEnv } = require("../config/env");

const logConfig = {
  appName: appEnv.APP_NAME,
  extractCallerFunc: (req) => req.caller,
  ignoreRoutes: [{ method: "GET", route: "/health-check" }],
  sensitiveRoutes: [],
  TZ: appEnv.TIME_ZONE,
  loggerOptions: {
    consoleConfig: { mode: process.env.NODE_ENV === "production" ? "prod" : "dev" },
    mongoConfig: { connectionString: appEnv.LOG_DB_CONNECTION_STRING },
  },
};

module.exports = { logConfig };
