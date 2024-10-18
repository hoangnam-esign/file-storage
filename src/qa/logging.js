const { appEnv } = require("../config/env");

const logConfig = {
  appName: appEnv.APP_NAME,
  extractCallerFunc: (req) => req.caller,
  ignoreRoutes: [{ method: "GET", route: "/health-check" }],
  sensitiveRoutes: [],
  mongoConfig: { connectionString: appEnv.LOG_DB_CONNECTION_STRING, collectionName: "request_logs" },
  TZ: appEnv.TIME_ZONE,
};

module.exports = { logConfig };
