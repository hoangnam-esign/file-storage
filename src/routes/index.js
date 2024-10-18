const express = require("express");

const router = express.Router();

const principalRouter = require("./principals/index");
const healthCheckerRouter = require("./health-checker/index");

router.use(principalRouter);
router.use(healthCheckerRouter);

module.exports = router;
