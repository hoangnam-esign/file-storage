const { getNotifier } = require("@hoangnam.io/qa-tools");
const { appEnv } = require("../config/env");

const { DISCORD_NOTIFY_URL } = appEnv;

const notifyingConfig = {
  discord: { url: DISCORD_NOTIFY_URL },
};
const notifier = getNotifier(notifyingConfig);

module.exports = { notifier };
