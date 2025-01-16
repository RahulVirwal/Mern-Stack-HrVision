const express = require("express");
const {
  handleLeaveApply,
  handleGetPendingLeave,
  handleGetHistoryLeave,
  handleGetMonthlyLeave,
  handleGetAllPendingLeave,
  handleUpdateLeaveStatus,
  handleGetLeaveNumber,
  handleGetUserLeaveDetailsOnDay,
  handleGetLeaveForProjectManager,
  handleDeleteLeaveData,
  handleGetAllHistoryLeave,
  handleAllPmHistory,
} = require("../controllers/leaveController");
const { fetchuser, restrictTo } = require("../middlewares/auth");

const router = express.Router();

router.post(
  "/apply",
  fetchuser,
  restrictTo(["HR", "Employee"]),
  handleLeaveApply
);
router.get("/pending", fetchuser, handleGetPendingLeave);

// For user
router.get("/history", fetchuser, handleGetHistoryLeave);

// For Admin & HR
router.get(
  "/allhistory",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleGetAllHistoryLeave
);

// For Pm
router.get("/allPmHistory", fetchuser, handleAllPmHistory);

router.get("/monthly", fetchuser, handleGetMonthlyLeave);
router.get(
  "/pending/all",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleGetAllPendingLeave
);

router.put(
  "/update",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleUpdateLeaveStatus
);

router.get("/count", fetchuser, handleGetLeaveNumber);
router.get("/byday", fetchuser, handleGetUserLeaveDetailsOnDay);
router.delete("/delete", fetchuser, handleDeleteLeaveData);

// Api for Project Manager

router.get("/pmleave", fetchuser, handleGetLeaveForProjectManager);
router.put("/pmupdate", fetchuser, handleUpdateLeaveStatus);

module.exports = router;
