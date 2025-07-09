const { getNotifier } = require("@hoangnam.io/qa-tools");
const { appEnv } = require("../config/env");

const notifyingConfig = {
  discord: { url: appEnv.DISCORD_NOTIFY_URL },
};
const notifier = getNotifier(notifyingConfig);

module.exports = { notifier };
