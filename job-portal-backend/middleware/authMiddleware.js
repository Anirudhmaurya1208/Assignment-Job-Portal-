

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user details to request
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ msg: "User not found, invalid token" });
    }

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// Role-based access control middleware
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized, user not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied, insufficient permissions" });
    }

    next();
  };
};

module.exports = { protect, authorizeRoles };
