const express = require("express");
const { fetchuser, restrictTo } = require("../middlewares/auth");
const {
  handleforgetAttendanceGenerate,
  handlegetupdateStatus,
  handleGetHistory,
  handlegetAllPending,
  handleGetPendingDataofUser,
  handleGetUserAttendanceByProjectManager,
  handleAllGetHistory,
  handleGetPendingDataOfMonthofUser,
  handleGetUserAttendanceHistoryByProjectManager,
  handleUpdateDirectAdmin,
} = require("../controllers/forgetattendanceController");
const router = express.Router();

router.post("/apply", fetchuser, handleforgetAttendanceGenerate);

router.put(
  "/update",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handlegetupdateStatus
);

router.get("/history", fetchuser, handleGetHistory);

router.get(
  "/allHistory",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleAllGetHistory
);

router.get(
  "/allpending",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handlegetAllPending
);
router.get(
  "/",
  fetchuser,
  restrictTo(["Employee", "HR"]),
  handleGetPendingDataofUser
);
router.get("/monthly", fetchuser, handleGetPendingDataOfMonthofUser);

// Api for Project Manager
router.get(
  "/pmforgetattendance",
  fetchuser,
  handleGetUserAttendanceByProjectManager
);
router.put("/pmupdate", fetchuser, handlegetupdateStatus);
router.get(
  "/pmhistory",
  fetchuser,
  handleGetUserAttendanceHistoryByProjectManager
);

// Update attendance time for admin
router.post(
  "/updateTime",
  fetchuser,
  restrictTo(["Admin"]),
  handleUpdateDirectAdmin
);

module.exports = router;
