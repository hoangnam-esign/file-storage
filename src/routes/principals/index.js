const express = require("express");
const { handlerWrapper } = require("../../common/utils");
const { createPrincipalSchema, genNewAccessTokenSchema } = require("./schema");
const { appEnv } = require("../../config/env");
const { connection, Collections } = require("../../db");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { authen, author } = require("../../access-control/protect-middleware");
const router = express.Router();

router.post(
  "/principals",
  authen,
  author([]),
  handlerWrapper(async (req, res) => {
    const { principalName, roles } = createPrincipalSchema.parse(req.body);
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
    const { refreshToken } = genNewAccessTokenSchema.parse(req.body);
    const decoded = jwt.verify(refreshToken, appEnv.JWT_SECRET);
    const coll = (await connection).db().collection(Collections.Principals);
    const doc = await coll.findOne({ principalId: decoded.principalId });
    if (!doc) return res.status(403).json({ message: "RefreshTokenError: refreshToken không còn tồn tại!" });
    const { principalId, principalName, roles } = doc;
    const accessTokenContent = { principalId, principalName, roles };
    const accessToken = jwt.sign(accessTokenContent, appEnv.JWT_SECRET, { expiresIn: appEnv.ACCESS_TOKEN_EXPIRE_TIME });
    return res.json({ accessToken });
  })
);

router.delete(
  "/principals/:principalId",
  authen,
  author([]),
  handlerWrapper(async (req, res) => {
    const { principalId } = req.params;
    if (!principalId) return res.status(400).json({ message: "principalId is required!" });
    const coll = (await connection).db().collection(Collections.Principals);
    const opResult = await coll.deleteOne({ principalId });
    return res.json(opResult);
  })
);

module.exports = router;
