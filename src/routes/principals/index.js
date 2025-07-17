const express = require("express");
const { handlerWrapper } = require("../../common/utils");
const { createPrincipalSchema, genNewAccessTokenSchema } = require("./schema");
const { appEnv } = require("../../config/env");
const { connection, Collections } = require("../../db");
const jwt = require("jsonwebtoken");
const { authen, author } = require("../../access-control/protect-middleware");
const { createNewPrincipal } = require("./utils");
const router = express.Router();

router.post(
  "/principals",
  handlerWrapper(async (req, res) => {
    const { secret, principalName, roles } = createPrincipalSchema.parse(req.body);
    if (secret !== appEnv.JWT_SECRET) {
      return res.status(401).json({ message: "secret is not correct!" });
    }
    const result = await createNewPrincipal({ principalName, roles });
    return res.json(result);
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
