const Attendance = require("../model/attendanceModel");
const Holiday = require("../model/holidayModel");

let check = false;

// Check if a date is a holiday
async function isHoliday(date) {
  const givenDate = new Date(date);
  const date1 = new Date(date);
  const startdate = new Date(date1).setHours(0, 0, 0, 0);
  const todate = new Date(date1).setHours(23, 59, 59, 999);

  const holidays = await Holiday.find({
    date: { $gte: startdate, $lte: todate },
    disabled: false,
  }).select("date");

  return holidays.some(
    (holiday) =>
      holiday.date.toISOString().split("T")[0] ===
      givenDate.toISOString().split("T")[0]
  );
}

// Sign-in route
async function handleAttendanceSignin(req, res) {
  const employeeId = req.user.id;
  const currentDate = new Date();
  const currentTime = currentDate.getHours();
  const date = currentDate.setHours(0, 0, 0, 0);
  const session1EndTime = 13;
  if (currentTime >= 14) {
    check = true;
  }

  try {

      // Check Holiday
      const checkDate = new Date();
      const isholiday = await isHoliday(checkDate);
      if (isholiday) {
      return res.status(404).json({
          status: "error",
          message: "Today is Holiday",
        });
      }

    let attendance = await Attendance.findOne({ employeeId, date });
    if (!attendance) {
      if (currentTime > session1EndTime) {
        attendance = new Attendance({
          employeeId,
          date,
          signInTime2: new Date(),
        });
      } else {
        attendance = new Attendance({
          employeeId,
          date,
          signInTime1: new Date(),
        });
      }
      await attendance.save();
      return res.status(200).json({
        status: "ok",
        message:
          currentTime > session1EndTime
            ? "Second sign-in successful"
            : "First sign-in successful",
        attendance,
      });
    }

    if (
      attendance.signInTime1 &&
      !attendance.signOutTime1 &&
      currentTime < 14
    ) {
      return res.status(400).json({
        status: "error",
        message: "Sign-out first before second sign-in.",
      });
    }

    if (
      attendance.signInTime1 &&
      (attendance.signOutTime1 || check) &&
      !attendance.signInTime2
    ) {
      if (currentTime > session1EndTime) {
        attendance.signInTime2 = new Date();
        await attendance.save();
        return res.status(200).json({
          status: "ok",
          message: "Second Sign-in successful",
          attendance,
        });
      }
      return res.status(400).json({
        status: "error",
        message: "Second Sign-in is failed. Try after 2:00 PM",
      });
    }

    return res
      .status(400)
      .json({ status: "error", message: "Already signed in two times today." });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
}

// Sign-out route
async function handleAttendanceSignout(req, res) {
  const employeeId = req.user.id;
  const date = new Date().setHours(0, 0, 0, 0); // Reset time to midnight for date comparison
  const currentDate = new Date();
  const currentTime = currentDate.getHours();
  const singOutTime = 14;
  try {
    const attendance = await Attendance.findOne({ employeeId, date });

    if (!attendance) {
      return res
        .status(400)
        .json({ status: "error", message: "Sign-in first." });
    }

    if (attendance.signInTime1 && !attendance.signOutTime1 && check) {
      if (currentTime < singOutTime) {
        attendance.signOutTime1 = new Date();
        await attendance.save();
        return res.status(200).json({
          status: "ok",
          message: "First sign-out successful",
          attendance,
        });
      }
    } else {
      check = true;
    }

    if (
      attendance.signInTime1 &&
      (attendance.signOutTime1 || check) &&
      !attendance.signInTime2 &&
      !attendance.signOutTime2
    ) {
      return res.status(400).json({
        status: "error",
        message: "Sign-in second after second sign-out.",
      });
    }

    if (
      attendance.signInTime2 &&
      !attendance.signOutTime2 &&
      currentTime >= 14
    ) {
      attendance.signOutTime2 = new Date();
      await attendance.save();
      return res.status(200).json({
        status: "ok",
        message: "Second sign-out successful",
        attendance,
      });
    }

    return res
      .status(400)
      .json({ status: "error", message: "Already signed out twice today." });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
}

// Get Attendance By Date
async function handleGetAttendanceByDate(req, res) {
  const employeeId = req.query.employeeId || req.user.id;
  const today = new Date();
  const { date = today } = req.query;

  try {
    const start = new Date(date);
    const startOfDay = new Date(start.setHours(0, 0, 0, 0));
    const endOfDay = new Date(start.setHours(23, 59, 59, 999));

    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    return res
      .status(200)
      .json({ status: "ok", message: "Attendance Retrieved", attendance });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
}

// Get Attendance By Weekly
async function handleAllAttendanceByWeekly(req, res) {
  const employeeId = req.query.employeeId || req.user.id;
  const today = new Date();
  const { date = today } = req.query;

  try {
    const end = new Date(date);
    const endOfDay = new Date(end.setHours(23, 59, 59, 999));
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    const startOfDay = new Date(start.setHours(0, 0, 0, 0));

    const attendanceData = await Attendance.find({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Create a map of dates to attendance data
    const attendanceMap = {};
    attendanceData.forEach((att) => {
      const date = att.date.toISOString().split("T")[0];
      attendanceMap[date] = att;
    });

    // Create an array of all dates in the week
    const datesOfWeek = [];
    for (
      let d = new Date(startOfDay);
      d <= endOfDay;
      d.setDate(d.getDate() + 1)
    ) {
      datesOfWeek.push(new Date(d).toISOString().split("T")[0]);
    }

    // Create the response array
    const response = datesOfWeek.map((date) => ({
      date,
      attendance: attendanceMap[date],
    }));

    res.status(200).json({
      status: "success",
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal Server error",
      error,
    });
  }
}

// Get Daily Attendance
async function handleGetSession(req, res) {
  try {
    const employeeId = req.user.id;
    const today = new Date();
    let signin = false;
    const currentHour = new Date().getHours();
    const startOfDay = new Date(today).setHours(0, 0, 0, 0);
    const endOfDay = new Date(today).setHours(23, 59, 59, 999);
    const attendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (!attendance) {
      signin = false;
    } else {
      const { signInTime1, signInTime2, signOutTime2 } = attendance;
      if ((signInTime1 && currentHour < 14) || (signInTime2 && !signOutTime2 && currentHour >= 14)) {
        signin = true;
      } else {
        signin = false;
      }
    }
    return res
      .status(200)
      .json({ status: "ok", message: "Successfull Signin", signin: signin });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
}

module.exports = {
  handleAttendanceSignin,
  handleAttendanceSignout,
  handleGetAttendanceByDate,
  handleAllAttendanceByWeekly,
  handleGetSession,
};
