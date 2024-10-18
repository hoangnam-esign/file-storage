require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { appEnv } = require("./config/env");
const { MB } = require("./constant");
const { logConfig } = require("./qa/logging");
const { createLogMiddleware, getErrorHandlerMiddleware } = require("@hoangnam.io/qa-tools");
const { notifier } = require("./qa/notifying");

const limit = appEnv.REQUEST_SIZE_LIMIT_IN_MB * MB;

const app = express();

app.use(express.json({ limit }));
app.use(express.urlencoded({ limit, extended: false }));
app.use(cors());

app.use(createLogMiddleware(app, logConfig));

app.use("/api", require("./routes/storage"));

app.use();

const errorHandler = getErrorHandlerMiddleware(notifier, (req) => req.caller, appEnv.APP_NAME);
app.use(errorHandler);

app.listen(appEnv.PORT, () => console.log(`App listening on port ${appEnv.PORT}!`));
