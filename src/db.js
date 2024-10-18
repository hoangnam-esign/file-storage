const { appEnv } = require("./config/env");
const { MongoClient } = require("mongodb");

const connection = new MongoClient(appEnv.MONGODB_CONNECT_STRING, {
  ignoreUndefined: true,
}).connect();

const Collections = {
  Principals: "principals",
};

module.exports = { Collections, connection };
