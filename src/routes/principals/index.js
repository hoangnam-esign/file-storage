const express = require("express");
const { handlerWrapper } = require("../../common/utils");
const { createPrincipalSchema, refreshTokenSchema } = require("./schema");
const { appEnv } = require("../../config/env");
const { connection, Collections } = require("../../db");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const router = express.Router();

router.post(
  "/principals",
  handlerWrapper(async (req, res) => {
    const { jwtSecret, principalName, roles } = createPrincipalSchema.parse(req.body);
    if (jwtSecret !== appEnv.JWT_SECRET) {
      return res.status(400).json({ message: "jwtSecret không chính xác!" });
    }
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

    return res.json({
      principalId,
      accessToken,
      refreshToken,
    });
  })
);

router.post(
  "/access-tokens",
  handlerWrapper(async (req, res) => {
    const { refreshToken } = refreshTokenSchema.parse(req.body);
    const decoded = jwt.verify(refreshToken, appEnv.JWT_SECRET);
    const coll = (await connection).db().collection(Collections.Principals);
    const doc = await coll.collection(Collections.RefreshTokens).findOne({ principalId: decoded.principalId });
    if (!doc) return res.status(403).json({ message: "RefreshTokenError: refreshToken không còn tồn tại!" });
    const { principalId, principalName, roles } = doc;
    const accessTokenContent = { principalId, principalName, roles };
    const accessToken = jwt.sign(accessTokenContent, appEnv.JWT_SECRET, { expiresIn: appEnv.ACCESS_TOKEN_EXPIRE_TIME });
    return res.json({ accessToken });
  })
);

module.exports = router;
