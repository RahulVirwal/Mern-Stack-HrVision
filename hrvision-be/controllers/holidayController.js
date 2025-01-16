const { findOne } = require("../model/attendanceModel");
const Holiday = require("../model/holidayModel");

// Create Holiday
async function handleHolidayCreate(req, res) {
  try {
    const { name, date, description } = req.body;
    const day = new Date(date);
    const startday = new Date(day).setHours(0, 0, 0, 0);
    const endday = new Date(day).setHours(23, 59, 59, 999);
    let holiday = await Holiday.findOne({
      date: { $gte: startday, $lte: endday },
      disabled: false,
    });
    if (!holiday) {
      holiday = await Holiday.create({
        name,
        date,
        description,
      });
      return res.status(200).json({
        status: "ok",
        message: "Successfully created Holiday",
        data: holiday,
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "sorry a holiday already exists on this date",
      });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

// Update Holiday
async function handleHolidayUpdate(req, res) {
  try {
    const { id, name, date, description } = req.body;
    let holiday = await Holiday.findById(id);
    if (holiday) {
      const updated_holiday = await Holiday.findByIdAndUpdate(
        id,
        { name, date, description },
        { new: true }
      );
      return res.status(200).json({
        status: "ok",
        message: "Successfully Holiday Updated",
        data: updated_holiday,
      });
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Holiday not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

// Delete Holiday
async function handleHolidayDelete(req, res) {
  try {
    const { id } = req.query;
    const holiday = await Holiday.findById(id);
    if (!holiday) {
      return res
        .status(400)
        .json({ status: "error", message: "Holiday not found" });
    }
    holiday.disabled = true;
    await holiday.save();
    return res.status(200).json({
      status: "ok",
      message: "Successfully Holiday Deleted",
      data: holiday,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

// Get All Holiday
async function handleGetAllHoliday(req, res) {
  try {
    const allHolidays = await Holiday.find({ disabled: false });

    // Initialize an object with keys for each month
    const holidaysByMonth = {
      January: [],
      February: [],
      March: [],
      April: [],
      May: [],
      June: [],
      July: [],
      August: [],
      September: [],
      October: [],
      November: [],
      December: [],
    };

    // Group holidays by month
    allHolidays.forEach((holiday) => {
      const holidayDate = new Date(holiday.date);
      const monthName = holidayDate.toLocaleString("en-US", { month: "long" });
      holidaysByMonth[monthName].push(holiday);
    });

    return res.status(200).json({
      code: "200",
      status: "ok",
      message: "Holiday list retrieved",
      data: holidaysByMonth,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = {
  handleHolidayCreate,
  handleHolidayUpdate,
  handleHolidayDelete,
  handleGetAllHoliday,
};
