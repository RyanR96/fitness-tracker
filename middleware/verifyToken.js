const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  //get auth header

  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    //req.token = bearerToken;
    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } else {
    res.sendStatus(403);
  }
}

module.exports = verifyToken;
