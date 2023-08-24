const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.sendStatus(401); // Unauthorized
  }

  // console.log("---authHeader", authHeader);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); // invalid token. Forbidden
    // console.log("----verify", decoded);
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;
