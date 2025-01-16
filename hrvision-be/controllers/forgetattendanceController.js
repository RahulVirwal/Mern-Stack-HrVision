const ForgetAttendance = require("../model/forgetattendanceModel");
const Attendance = require("../model/attendanceModel");
const { User } = require("../model/userModel");
const Leave = require("../model/leaveModel");
const Holiday = require("../model/holidayModel");

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

// Create Forget Attendance
async function handleforgetAttendanceGenerate(req, res) {
  try {
    const employeeId = req.user.id;
    const { date, reason, session } = req.body;
    const finddate = new Date(date);
    const startdate = new Date(finddate).setHours(0, 0, 0, 0);
    const enddate = new Date(finddate).setHours(23, 59, 59, 999);
    const employeeAttendance = await Attendance.findOne({
      employeeId,
      date: { $gte: startdate, $lte: enddate },
    });

    const today = new Date();

    if (today < finddate) {
      return res.status(400).json({
        status: "error",
        message: "You can not apply future date",
      });
    }

    // Check Holiday
    const isholiday = await isHoliday(date);
    if (isholiday) {
      return res.status(404).json({
        status: "error",
        message: "Your Aplied Date is Holiday",
      });
    }

    const login_user = await User.findById(employeeId);

    if (!employeeAttendance && session != "FullDay") {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found for provided date.",
      });
    }

    if (!employeeAttendance && session === "FullDay") {
      const newdata = await Attendance.create({
        employeeId,
        date,
      });
      const attendanceId = newdata._id;
      const forgetAttendance = await ForgetAttendance.create({
        date: finddate,
        userName: login_user.name || "",
        attendanceId,
        employeeId,
        reason,
        session,
      });
      return res.status(200).json({
        status: "ok",
        message: "Successfully created ForgetAttendance",
        Attendance_data: newdata,
        data: forgetAttendance,
      });
    }

    const todayDay = await ForgetAttendance.findOne({
      employeeId,
      date: { $gte: startdate, $lte: enddate },
    });

    if (todayDay) {
      return res.status(400).json({
        status: "error",
        message: "You already apply one time on this date",
      });
    }

    if (session === "Session1") {
      if (employeeAttendance.signInTime1 && employeeAttendance.signOutTime1) {
        return res.status(400).json({
          status: "error",
          message: "You already Signin and Signout on this session",
        });
      }
    } else if (session === "Session2") {
      if (employeeAttendance.signInTime2 && employeeAttendance.signOutTime2) {
        return res.status(400).json({
          status: "error",
          message: "You already Signin and Signout on this session",
        });
      }
    } else if (session === "FullDay") {
      if (employeeAttendance.signOutTime1 && employeeAttendance.signOutTime2) {
        return res.status(400).json({
          status: "error",
          message: "You already Signin and Signout on this Day",
        });
      }
    } else {
      return res.status(400).json({
        status: "error",
        message: "Please Select Right",
      });
    }

    const attendanceId = employeeAttendance._id;
    const forgetAttendance = await ForgetAttendance.create({
      date: finddate,
      userName: login_user.name || "",
      attendanceId,
      employeeId,
      reason,
      session,
    });
    return res.status(200).json({
      status: "ok",
      message: "Successfully created ForgetAttendance",
      data: forgetAttendance,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

// Update Status
async function handlegetupdateStatus(req, res) {
  try {
    const login_user_role = req.user.role;
    const { attendanceId, status, session } = req.body;

    // Ensure 'status' is a string and valid
    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const forgat_attdance = await ForgetAttendance.findOne({
      attendanceId,
      status: "pending",
    });

    // Check if forgat_attdance is null
    if (!forgat_attdance) {
      return res
        .status(400)
        .json({ status: "error", message: "No Pending data found" });
    }

    const user = await User.findById(forgat_attdance.employeeId);
    const applied_leave_user_role = user.role;

    if (applied_leave_user_role === "HR" && login_user_role !== "Admin") {
      return res.status(403).json({
        status: "error",
        message: "Only Admin can approve/reject HR leave applications",
      });
    }

    let projectmanager;
    if (user.projectManagerId) {
      projectmanager = await User.findById(user.projectManagerId);
    }
    const updatedby =
      login_user_role !== "HR" && login_user_role !== "Admin"
        ? projectmanager.name
        : login_user_role;

    const update_status = await ForgetAttendance.findByIdAndUpdate(
      forgat_attdance._id,
      { status, approvedBy: updatedby },
      { new: true }
    );

    const attendance = await Attendance.findById(attendanceId);
    if (update_status.status === "approved") {
      if (session === "FullDay") {
        attendance.signInTime1 = new Date(attendance.date).setHours(
          9,
          30,
          0,
          0
        );
        attendance.signOutTime1 = new Date(attendance.date).setHours(
          13,
          0,
          0,
          0
        );
        attendance.signInTime2 = new Date(attendance.date).setHours(
          14,
          0,
          0,
          0
        );
        attendance.signOutTime2 = new Date(attendance.date).setHours(
          18,
          30,
          0,
          0
        );
        await attendance.save();
      } else if (session === "Session1") {
        if (attendance.signInTime1) {
          attendance.signOutTime1 = new Date(attendance.date).setHours(
            13,
            0,
            0,
            0
          );
        } else {
          attendance.signInTime1 = new Date(attendance.date).setHours(
            9,
            30,
            0,
            0
          );
          attendance.signOutTime1 = new Date(attendance.date).setHours(
            13,
            0,
            0,
            0
          );
        }
        await attendance.save();
      } else if (session === "Session2") {
        if (attendance.signInTime2) {
          attendance.signOutTime2 = new Date(attendance.date).setHours(
            18,
            30,
            0,
            0
          );
        } else {
          attendance.signInTime2 = new Date(attendance.date).setHours(
            14,
            0,
            0,
            0
          );
          attendance.signOutTime2 = new Date(attendance.date).setHours(
            18,
            30,
            0,
            0
          );
        }
        await attendance.save();
      } else {
        return res.status(400).json({
          status: "error",
          message: "Please Give me valid session time",
        });
      }
    }

    return res.status(200).json({
      status: "ok",
      message: "Successfully update status",
      data: update_status,
      approved_requested_attendance: attendance,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

// Get All Pending Data
async function handlegetAllPending(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const All_forgetAttendanceRequest = await ForgetAttendance.find({
      status: "pending",
    })
      .skip(skip)
      .limit(limit);

    if (!All_forgetAttendanceRequest) {
      return res.status(400).json({
        status: "error",
        message: "No pending data found",
        data: data,
      });
    }

    const records = await ForgetAttendance.find({
      status: "pending",
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "ForgetAttendance list Retrieved",
      data: All_forgetAttendanceRequest,
      pagination: {
        current: Number(page),
        limit: Number(limit),
        next: {
          page: Number(page) < pages ? Number(page) + 1 : null,
          limit: Number(limit),
        },
        pages: pages,
        records: records,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

// Get History
async function handleGetHistory(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  const employeeId = req.query.employeeId || req.user.id;
  try {
    const forgetAttendance_History_data = await ForgetAttendance.find({
      employeeId,
      status: { $in: ["approved", "rejected"] },
    })
      .skip(skip)
      .limit(limit);

    if (!forgetAttendance_History_data) {
      return res.status(400).json({
        status: "error",
        message: "No History data found",
        data: data,
      });
    }

    const records = await ForgetAttendance.find({
      employeeId,
      status: { $in: ["approved", "rejected"] },
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "ForgetAttendance History Retrived",
      data: forgetAttendance_History_data,
      pagination: {
        current: Number(page),
        limit: Number(limit),
        next: {
          page: Number(page) < pages ? Number(page) + 1 : null,
          limit: Number(limit),
        },
        pages: pages,
        records: records,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

// Get All History
async function handleAllGetHistory(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const forgetAttendance_History_data = await ForgetAttendance.find({
      status: { $in: ["approved", "rejected"] },
    })
      .skip(skip)
      .limit(limit);

    if (!forgetAttendance_History_data) {
      return res.status(400).json({
        status: "error",
        message: "No History data found",
        data: data,
      });
    }

    const records = await ForgetAttendance.find({
      status: { $in: ["approved", "rejected"] },
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "ForgetAttendance History Retrieved",
      data: forgetAttendance_History_data,
      pagination: {
        current: Number(page),
        limit: Number(limit),
        next: {
          page: Number(page) < pages ? Number(page) + 1 : null,
          limit: Number(limit),
        },
        pages: pages,
        records: records,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

// Get Pending Data of Login User
async function handleGetPendingDataofUser(req, res) {
  try {
    const employeeId = req.user.id;
    const data = await ForgetAttendance.find({
      employeeId,
      status: "pending",
    });

    if (!data) {
      return res.status(400).json({
        status: "error",
        message: "No pending data found",
        data: data,
      });
    }

    return res.status(200).json({
      status: "ok",
      message: "ForgetAttendance list Retrieved",
      data: data,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

// Get ForgetAttendance which is assigned Project Manager
async function handleGetUserAttendanceByProjectManager(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const projectManagerId = req.query.id || req.user.id;
    const users = await User.find({ projectManagerId: projectManagerId });
    let records;
    const forgetAttendance_data = await Promise.all(
      users.map(async (user) => {
        const data = await ForgetAttendance.find({
          employeeId: user._id,
          status: "pending",
        })
          .skip(skip)
          .limit(limit);
        records = await ForgetAttendance.find({
          employeeId: user._id,
          status: "pending",
        }).countDocuments();
        return data;
      })
    );
    const final_data = forgetAttendance_data.flat();

    const pages = Math.ceil(records / limit);
    return res.status(200).json({
      status: "ok",
      message: "All Forget Attendance list Retrieved",
      data: final_data,
      pagination: {
        current: Number(page),
        limit: Number(limit),
        next: {
          page: Number(page) < pages ? Number(page) + 1 : null,
          limit: Number(limit),
        },
        pages: pages,
        records: records,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
}

// Get ForgetAttendance History which is assigned Project Manager
async function handleGetUserAttendanceHistoryByProjectManager(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const projectManagerId = req.query.id || req.user.id;
    const users = await User.find({ projectManagerId: projectManagerId });
    let records;
    const forgetAttendance_data = await Promise.all(
      users.map(async (user) => {
        const data = await ForgetAttendance.find({
          employeeId: user._id,
          status: { $in: ["approved", "rejected"] },
        })
          .skip(skip)
          .limit(limit);
        records = await ForgetAttendance.find({
          employeeId: user._id,
          status: { $in: ["approved", "rejected"] },
        }).countDocuments();
        return data;
      })
    );
    const final_data = forgetAttendance_data.flat();

    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "All Forget Attendance list Retrieved",
      data: final_data,
      pagination: {
        current: Number(page),
        limit: Number(limit),
        next: {
          page: Number(page) < pages ? Number(page) + 1 : null,
          limit: Number(limit),
        },
        pages: pages,
        records: records,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
}

// Get Pending Data of Login User of Month
async function handleGetPendingDataOfMonthofUser(req, res) {
  try {
    const curr_month = new Date().getMonth();
    const curr_year = new Date().getFullYear();

    const employeeId = req.user.id;

    const { date } = req.query;

    const given_date = date ? new Date(date) : new Date();
    const given_month = given_date.getMonth();
    const given_year = given_date.getFullYear();
    const month = given_month || curr_month;
    const year = given_year || curr_year;

    // Create start and end dates for the specified month
    const startdate = new Date(year, month, 1);
    const enddate = new Date(year, month + 1, 1);

    const employee_id = employeeId || req.user.id;

    const attendance_data = await Attendance.find({
      employeeId: employee_id,
      date: { $gte: startdate, $lt: enddate },
    });

    const final_data = attendance_data.filter((data) => {
      if (
        !data.signInTime1 ||
        !data.signInTime2 ||
        !data.signOutTime1 ||
        !data.signOutTime2
      )
        return data;
    });

    return res.status(200).json({
      status: "ok",
      message: "ForgetAttendance list Retrieved",
      data: final_data,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

// Admin side direct fill attendance
async function handleUpdateDirectAdmin(req, res) {
  const { employeeId, date, session } = req.body;
  try {
    const dateAttendance = new Date(date);

    const today = new Date();

    if (today < dateAttendance) {
      return res.status(400).json({
        status: "error",
        message: "You can not apply future date",
      });
    }

    let data;
    const attendance = await Attendance.findOne({
      employeeId,
      date: dateAttendance,
    });

    if (session === "FullDay") {
      if (!attendance) {
        const newAttendance = await Attendance.create({
          employeeId,
          date: dateAttendance,
        });

        newAttendance.signInTime1 = new Date(newAttendance.date).setHours(
          9,
          30,
          0,
          0
        );
        newAttendance.signOutTime1 = new Date(newAttendance.date).setHours(
          13,
          0,
          0,
          0
        );
        newAttendance.signInTime2 = new Date(newAttendance.date).setHours(
          14,
          0,
          0,
          0
        );
        newAttendance.signOutTime2 = new Date(newAttendance.date).setHours(
          18,
          30,
          0,
          0
        );
        await newAttendance.save();

        data = newAttendance;
      } else {
        attendance.signInTime1 = new Date(attendance.date).setHours(
          9,
          30,
          0,
          0
        );
        attendance.signOutTime1 = new Date(attendance.date).setHours(
          13,
          0,
          0,
          0
        );
        attendance.signInTime2 = new Date(attendance.date).setHours(
          14,
          0,
          0,
          0
        );
        attendance.signOutTime2 = new Date(attendance.date).setHours(
          18,
          30,
          0,
          0
        );
        await attendance.save();
      }
    } else if (session === "Session1") {
      if (!attendance) {
        return res.status(404).json({
          status: "error",
          message: "Attendance data not found",
        });
      } else {
        if (attendance.signInTime1) {
          attendance.signOutTime1 = new Date(attendance.date).setHours(
            13,
            0,
            0,
            0
          );
        } else {
          attendance.signInTime1 = new Date(attendance.date).setHours(
            9,
            30,
            0,
            0
          );
          attendance.signOutTime1 = new Date(attendance.date).setHours(
            13,
            0,
            0,
            0
          );
        }
        await attendance.save();
      }
    } else if (session === "Session2") {
      if (!attendance) {
        return res.status(404).json({
          status: "error",
          message: "Attendance data not found",
        });
      }

      if (attendance.signInTime2) {
        attendance.signOutTime2 = new Date(attendance.date).setHours(
          18,
          30,
          0,
          0
        );
      } else {
        attendance.signInTime2 = new Date(attendance.date).setHours(
          14,
          0,
          0,
          0
        );
        attendance.signOutTime2 = new Date(attendance.date).setHours(
          18,
          30,
          0,
          0
        );
      }
      await attendance.save();
    } else {
      return res.status(400).json({
        status: "error",
        message: "Please Give me valid session time",
      });
    }
    return res.status(200).json({
      status: "ok",
      message: "Successfully attendance fill by admin",
      approved_requested_attendance: data ?? attendance,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server error" });
  }
}

module.exports = {
  handleforgetAttendanceGenerate,
  handlegetupdateStatus,
  handlegetAllPending,
  handleGetHistory,
  handleAllGetHistory,
  handleGetPendingDataofUser,
  handleGetUserAttendanceByProjectManager,
  handleGetPendingDataOfMonthofUser,
  handleGetUserAttendanceHistoryByProjectManager,
  handleUpdateDirectAdmin,
};
