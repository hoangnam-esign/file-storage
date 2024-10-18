const express = require("express");
const { connection, Collections } = require("../../db");
const { handlerWrapper } = require("../../common/utils");
const router = express.Router();

router.get(
  "/health-check",
  handlerWrapper(async (req, res) => {
    const coll = (await connection).db().collection(Collections.Accounts);
    await coll.findOne({});
    return res.sendStatus(200);
  })
);

module.exports = router;
