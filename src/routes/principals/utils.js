const { appEnv } = require("../../config/env");
const { connection, Collections } = require("../../db");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

async function createNewPrincipal({ principalName, roles }) {
  const principalId = v4();
  const newPrincipal = {
    principalId,
    principalName,
    roles,
  };
  const coll = (await connection).db().collection(Collections.Principals);
  await coll.insertOne(newPrincipal);

  const accessTokenContent = newPrincipal;
  const accessToken = jwt.sign(accessTokenContent, appEnv.JWT_SECRET, { expiresIn: appEnv.ACCESS_TOKEN_EXPIRE_TIME });
  const refreshTokenContent = { principalId };
  const refreshToken = jwt.sign(refreshTokenContent, appEnv.JWT_SECRET);

  return { principalId, accessToken, refreshToken };
}

module.exports = { createNewPrincipal };
