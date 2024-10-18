const fs = require("fs");
const path = require("path");
const { appEnv } = require("./config/env");

function init() {
  const storageFolder = path.join(appEnv.BASE_FOLDER_PATH);
  if (!fs.existsSync(storageFolder)) {
    fs.mkdirSync(storageFolder, { recursive: true });
  }
}

module.exports = { init };
