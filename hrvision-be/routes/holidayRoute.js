const express = require("express");
const { fetchuser, restrictTo } = require("../middlewares/auth");
const {
  handleHolidayCreate,
  handleHolidayUpdate,
  handleHolidayDelete,
  handleGetAllHoliday,
} = require("../controllers/holidayController");

const router = express.Router();

router.post(
  "/create",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleHolidayCreate
);
router.put(
  "/update",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleHolidayUpdate
);
router.delete(
  "/delete",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  handleHolidayDelete
);
router.get("/all", fetchuser, handleGetAllHoliday);

module.exports = router;
