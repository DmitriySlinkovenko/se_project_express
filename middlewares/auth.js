const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const ForbiddenError = require("../errors/ForbiddenError");

module.exports.auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    next(new ForbiddenError("Authorization required."));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new ForbiddenError("Authorization required."));
  }

  req.user = payload;

  return next();
};
