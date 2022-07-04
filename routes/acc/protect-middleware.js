const jwt = require("jsonwebtoken");
const { totpAxios } = require("../../config/axios-instances");

function authen(req, res, next) {
  if (!req.headers["authorization"]) {
    return res.status(400).send("Access Denied. Authorization header is required!");
  }

  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(400).send("Access Denied. Check your Authorization header format! (Bearer token)");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send(JSON.stringify(err));
  }
}

function author(roles) {
  return function(req, res, next) {
    if (!roles.includes(req.user.role)) return res.status(403).send("Forbidden!");
    next();
  };
}

async function totp(req, res, next) {
  try {
    // FIXME:
    const devMode = true;
    if (devMode) return next();
    const teacherId = req.user.email;
    const { totp } = req.body;
    const response = await totpAxios.post("/verify", { user_id: teacherId, code: totp });
    const valid = response.data.valid;
    if (valid) next();
    else return res.status(400).send("TOTP không chính xác!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Cannot verify TOTP against TOTP Server!");
  }
}

// this one is normal function, not middle-ware
async function verifyTOTP(teacherId, totp) {
  const response = await totpAxios.post("/verify", { user_id: teacherId, code: totp });
  return response.data.valid;
}

module.exports = { authen, author, totp, verifyTOTP };