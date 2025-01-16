const express = require("express");
const {
  handleUpdateuser,
  handleDeleteuser,
  handleGetAllUsers,
  handleGetUser,
  handleGetProjectManager,
  handleGetDeleteUser,
} = require("../controllers/userController.js");
const { fetchuser, restrictTo } = require("../middlewares/auth.js");

const router = express.Router();

router.get("/", fetchuser, handleGetUser);

// Get all users route with authentication middlewares
router.get("/all", fetchuser, restrictTo(["Admin", "HR"]), handleGetAllUsers);
router.put("/", fetchuser, restrictTo(["Admin", "HR"]), handleUpdateuser);
router.delete("/", fetchuser, restrictTo(["Admin", "HR"]), handleDeleteuser);

// Get all Project Manager
router.get(
  "/pm",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleGetProjectManager
);

// Get All disable user
router.get("/disable", fetchuser, restrictTo(["Admin"]), handleGetDeleteUser);

module.exports = router;
