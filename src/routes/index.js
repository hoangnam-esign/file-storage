const express = require("express");
const router = express.Router();
const principalRouter = require("./principals/index");
const healthCheckerRouter = require("./health-checker/index");
const storageRouter = require("./storage/index");

router.use(principalRouter);
router.use(healthCheckerRouter);
router.use(storageRouter);

module.exports = router;
