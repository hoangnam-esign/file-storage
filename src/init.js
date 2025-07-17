const fs = require("fs");
const path = require("path");
const { appEnv } = require("./config/env");
const { connection, Collections } = require("./db");
const { createNewPrincipal } = require("./routes/principals/utils");
const { RoleEnum } = require("./access-control/role");

function init() {
  const storageFolder = path.join(appEnv.BASE_FOLDER_PATH);
  if (!fs.existsSync(storageFolder)) {
    fs.mkdirSync(storageFolder, { recursive: true });
  }
  createPrincipalForCredentialsManager();
}

async function createPrincipalForCredentialsManager() {
  const coll = (await connection).db().collection(Collections.Principals);
  const count = await coll.countDocuments({});
  // console.log("🚧 --> createPrincipalForCredentialsManager --> count:", count);
  if (count == 0) {
    console.log("Init: createPrincipalForCredentialsManager:");
    const result = await createNewPrincipal({ principalName: "CredentialManager", roles: [RoleEnum.enum.READER, RoleEnum.enum.WRITER] });
    console.log(result);
  }
}

module.exports = { init };
