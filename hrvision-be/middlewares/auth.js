var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.SECRETKEY;
const { User } = require("../model/userModel");

// Fetch User
const fetchuser = async (req, res, next) => {
  // Get user from JWT and add it into req object
  const token = req.header("jwt-token");
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Please authenticate using valid token",
    });
  }
  try {
    // Verify token
    const data = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(data.user.id);
    if (!user) {
      res.clearCookie("jwt-token");
      return res
        .status(401)
        .json({ status: "error", message: "Invalid token" });
    }

    if (user.role !== "Admin") {
      if (user.tokenVersion !== data.user.tokenVersion) {
        return res.status(401).json({ message: "Token is no longer valid" });
      }
    }

    if (user.disabled == true) {
      res.clearCookie("jwt-token");
      return res.status(401).json({
        status: "error",
        message: "Your account has been deleted. Please log in new user.",
      });
    }

    if (user.uniqueId !== data.user.uniqueId) {
      res.clearCookie("jwt-token");
      return res.status(401).json({
        status: "error",
        message: "Please login your account",
      });
    }
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(500)
      .send({ status: "error", message: "Internal Server error" });
  }
};

// Restrinct User
function restrictTo(roles) {
  return function (req, res, next) {
    try {
      if (!req.user || !req.user.role) {
        return res
          .status(401)
          .json({ status: "error", message: "Invalid token" });
      }

      // Employee , HR, Admin
      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ status: "error", message: `Only access By ${roles}` });
      }
      return next();
    } catch (error) {
      return res
        .status(500)
        .send({ status: "error", message: "Internal Server error" });
    }
  };
}

module.exports = {
  fetchuser,
  restrictTo,
};
