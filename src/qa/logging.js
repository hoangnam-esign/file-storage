const { appEnv } = require("../config/env");

const logConfig = {
  appName: appEnv.APP_NAME,
  extractCallerFunc: (req) => req.caller,
  ignoreRoutes: [{ method: "GET", route: "/health-check" }],
  sensitiveRoutes: [],
  TZ: appEnv.TIME_ZONE,
  loggerOptions: {
    consoleConfig: { mode: appEnv.ENV },
    // mongoConfig: { connectionString: appEnv.LOG_DB_CONNECTION_STRING },
  },
};

if (appEnv.LOG_DB_CONNECTION_STRING) {
  logConfig.loggerOptions.mongoConfig = { connectionString: appEnv.LOG_DB_CONNECTION_STRING };
}

module.exports = { logConfig };
