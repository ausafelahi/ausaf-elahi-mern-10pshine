const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require("../models/Token");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const blacklistedToken = await Token.findOne({ token });
      if (blacklistedToken) {
        req.log.warn("Attempt to use blacklisted token");
        return res.status(401).json({
          success: false,
          message: "Token is no longer valid. Please login again.",
        });
      }

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Not authorized, user not found",
        });
      }

      req.token = token;

      req.log.info(`User authenticated: ${req.user.email}`);
      next();
    } catch (error) {
      req.log.error(`Authentication error: ${error.message}`);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Not authorized, token failed",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token",
    });
  }
  console.log("AUTH HEADER:", req.headers.authorization);
  console.log("JWT_SECRET:", process.env.JWT_SECRET);
};

module.exports = { protect };
