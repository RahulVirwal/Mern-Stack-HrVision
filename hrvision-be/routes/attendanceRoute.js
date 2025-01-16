const express = require("express");
const { fetchuser, restrictTo } = require("../middlewares/auth");
const {
  handleAttendanceSignin,
  handleAttendanceSignout,
  handleGetAttendanceByDate,
  handleAllAttendanceByWeekly,
  handleGetSession,
} = require("../controllers/attendanceController");

const router = express.Router();

router.post(
  "/signIn",
  fetchuser,
  restrictTo(["HR", "Employee"]),
  handleAttendanceSignin
);
router.post(
  "/signOut",
  fetchuser,
  restrictTo(["HR", "Employee"]),
  handleAttendanceSignout
);

router.get("/", fetchuser, handleGetAttendanceByDate);

router.get("/weekly", fetchuser, handleAllAttendanceByWeekly);

router.get("/details",fetchuser,handleGetSession);

module.exports = router;
