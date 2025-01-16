const express = require("express");
const {
  handleUserSingup,
  handleUserLogin,
} = require("../controllers/authController");
const { fetchuser, restrictTo } = require("../middlewares/auth.js");

const router = express.Router();

// Signup route
router.post(
  "/signup",
  // fetchuser,
  // restrictTo(["Admin", "HR"]),
  handleUserSingup
);

// Login route
router.post("/login", handleUserLogin);

module.exports = router;
