const jwt = require("jsonwebtoken");
const { Roles } = require("./role");

function authen(req, res, next) {
  if (!req.headers["authorization"]) {
    return res.status(401).send("Access Denied. Authorization header is required!");
  }

  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(400).send("Access Denied. Check your Authorization header format! (Bearer token)");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.caller = verified;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "TokenExpiredError" });
    }
    next(err);
  }
}

function author(roles) {
  return function (req, res, next) {
    if (req.caller.roles.includes(Roles.ADMIN)) return next();
    const intersection = roles.filter((role) => req.caller.roles.includes(role));
    if (intersection.length === 0) return res.status(403).send("Forbidden!");
    next();
  };
}

module.exports = { authen, author };
