const express = require("express");
const { connection, Collections } = require("../../db");
const { handlerWrapper } = require("../../common/utils");
const router = express.Router();

router.get(
  "/health-check",
  handlerWrapper(async (req, res) => {
    const coll = (await connection).db().collection(Collections.Principals);
    await coll.findOne({});
    return res.status(200).json({ message: "I'm alive.", version: "1.0.3+3" });
  })
);

module.exports = router;
