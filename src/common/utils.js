const fs = require("fs");
const path = require("path");

const handlerWrapper = (handler) => async (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function genDateTimeString() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "T" + d.getHours() + "h" + d.getMinutes() + "m" + d.getSeconds() + "s" + "___";
}

function saveFile(baseFolder, subFolder, originalFileName, buffer) {
  const folderPath = path.join(baseFolder, subFolder);
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
  const fileName = genDateTimeString() + originalFileName;
  const filePath = path.join(folderPath, fileName);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

async function sleeper(ms) {
  return new Promise((resolve) => setTimeout(() => resolve(), ms));
}

module.exports = { genDateTimeString, saveFile, sleeper, handlerWrapper };
