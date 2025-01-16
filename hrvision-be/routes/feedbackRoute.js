const express = require("express");
const { fetchuser, restrictTo } = require("../middlewares/auth");
const {
  handleApplyFeedback,
  handleGetAllFeddback,
  handleGetUserAllFeedback,
} = require("../controllers/feedbackController");

const router = express.Router();

router.post(
  "/apply",
  fetchuser,
  restrictTo(["HR", "Employee"]),
  handleApplyFeedback
);

router.get("/all", fetchuser, restrictTo(["Admin"]), handleGetAllFeddback);

router.get("/",fetchuser,handleGetUserAllFeedback);

module.exports = router;
