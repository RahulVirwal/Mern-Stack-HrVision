const mongoose = require("mongoose");
const Leave = require("../model/leaveModel");
const { User } = require("../model/userModel");
const Holiday = require("../model/holidayModel");

// Generate Leave Day count data function
async function CountLeaveDay(
  fromdate,
  enddate,
  fromSession1,
  fromSession2,
  endSession1,
  endSession2
) {
  const startdate = new Date(fromdate);
  const todate = new Date(enddate);

  const holidays = await Holiday.find({
    date: { $gte: startdate, $lte: todate },
    disabled: false,
  }).select("date");

  // Helper function to generate date range array of particular leave
  const getDatesInRange = (startdate, todate) => {
    const data = [];
    let currentDate = new Date(startdate);
    while (currentDate <= todate) {
      data.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return data;
  };

  // Check if a date is a holiday
  const isHoliday = (date) => {
    return holidays.some(
      (holiday) =>
        holiday.date.toISOString().split("T")[0] ===
        date.toISOString().split("T")[0]
    );
  };

  // Calculate all leave days within the range
  let allLeaveDays = [];
  const leavedays = getDatesInRange(startdate, todate);
  allLeaveDays = [...allLeaveDays, ...leavedays];

  // Filter the Leave days
  let daysOfLeave = allLeaveDays.filter((date) => {
    return date >= startdate && date <= todate && !isHoliday(date);
  });

  let finalleaveDays = Array.from(
    new Set(daysOfLeave.map((date) => date.toISOString()))
  ).map((date) => new Date(date));

  let leaveDayCount = finalleaveDays.length;
  if (leaveDayCount == 0) {
    return leaveDayCount;
  }

  // Single-day leave
  if (startdate.toDateString() === todate.toDateString()) {
    if (fromSession1 === true && fromSession2 === false) {
      leaveDayCount = 0.5; // Half-day leave for the first session
    } else if (fromSession2 === true && fromSession1 === false) {
      leaveDayCount = 0.5; // Half-day leave for the second session
    } else {
      leaveDayCount = 1; // Full-day leave
    }
  } else {
    // Multiple-day leave
    if (fromSession2) {
      leaveDayCount -= 0.5; // Half-day leave on start date
    }
    if (endSession1) {
      leaveDayCount -= 0.5; // Half-day leave on end date
    }
  }

  return leaveDayCount;
}

// For Applying Leave
async function handleLeaveApply(req, res) {
  const employeeId = req.user.id;
  try {
    const {
      leaveType,
      fromDate,
      toDate,
      fromSession1,
      fromSession2,
      endSession1,
      endSession2,
      contact,
      reason,
    } = req.body;

    if (!req.body) {
      return res.status(400).json({
        status: "error",
        message: "Please fill up all required fields",
      });
    }

    // Count Leave Days
    const total_leaveDays = await CountLeaveDay(
      fromDate,
      toDate,
      fromSession1,
      fromSession2,
      endSession1,
      endSession2
    );

    const fromdate = new Date(fromDate);
    const todate = new Date(toDate);

    // Check if fromDate and toDate are valid
    if (fromdate > todate || todate < fromdate) {
      return res
        .status(400)
        .json({ status: "error", message: "Please select the correct dates" });
    }

    // Find user to access fields of user
    const user = await User.findOne({ _id: employeeId });

    // Check remaining leave balance
    if (
      (leaveType === "paid" && user.remainingPaidLeave < total_leaveDays) ||
      (leaveType === "sick" && user.remainingSickLeave < total_leaveDays) ||
      (leaveType === "compOff" && user.remainingCompOffLeave < total_leaveDays)
    ) {
      return res.status(400).json({
        status: "error",
        message:
          "Insufficient leave balance. Please check your leave balance and try again.",
      });
    }
    const startofdate = new Date(fromDate);
    const toofdate = new Date(toDate);

    // Check for overlapping leave applications
    const existingLeaves = await Leave.find({
      employeeId,
      $or: [
        { fromDate: { $lte: startofdate }, toDate: { $gte: toofdate } },
        { fromDate: { $gte: startofdate }, toDate: { $lte: toofdate } },
        { fromDate: toofdate },
        { toDate: startofdate },
      ],
      $nor: [{ status: "rejected" }],
      disabled: false,
    });

    for (let leave of existingLeaves) {
      if (leave.fromDate.toISOString() === leave.toDate.toISOString()) {
        // Handle exact match single day leave with sessions
        if (
          leave.fromDate.toISOString() === startofdate.toISOString() &&
          leave.fromDate.toISOString() === toofdate.toISOString()
        ) {
          if (leave.fromSession1 && fromSession1) {
            return res.status(400).json({
              status: "error",
              message: "You already applied leave for this session",
            });
          }
          if (leave.fromSession2 && fromSession2) {
            return res.status(400).json({
              status: "error",
              message: "You already applied leave for this session",
            });
          }
        }
      } else {
        // Handle multi-day leave with session logic
        if (
          leave.fromDate.toISOString() === startofdate.toISOString() ||
          leave.toDate.toISOString() === toofdate.toISOString() ||
          (leave.fromDate.toISOString() === toofdate.toISOString() &&
            leave.fromSession1) ||
          (leave.toDate.toISOString() === startofdate.toISOString() &&
            leave.endSession2) ||
          (leave.fromDate.toISOString() === toofdate.toISOString() &&
            leave.fromSession2 &&
            endSession2) ||
          (leave.toDate.toISOString() === startofdate.toISOString() &&
            leave.endSession1 &&
            fromSession1)
        ) {
          return res.status(400).json({
            status: "error",
            message: "You already applied leave for this session",
          });
        }
      }
    }

    // Create new leave if no conflicts found
    const leave = await Leave.create({
      employeeId,
      userName: user.name,
      leaveType,
      fromDate,
      toDate,
      fromSession1,
      fromSession2,
      endSession1,
      endSession2,
      contact,
      reason,
      leaveDays: total_leaveDays,
    });
    return res.status(200).json({
      status: "ok",
      message: "Leave applied successfully",
      data: leave,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal server error", error });
  }
}

// Check Pending Leave
async function handleGetPendingLeave(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    let skip = (page - 1) * limit;
    const employeeId = req.query.employeeId || req.user.id;

    const pendingLeaves = await Leave.find({
      employeeId,
      status: "pending",
      disabled: false,
    })
      .skip(skip)
      .limit(limit);

    const records = await Leave.find({
      employeeId,
      status: "pending",
      disabled: false,
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "Pending Leave list retrieved",
      data: pendingLeaves,
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

// Get All History of user Leave
async function handleGetHistoryLeave(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  const employeeId = req.query.employeeId || req.user.id;
  try {
    const leaves = await Leave.find({
      employeeId,
      status: { $in: ["approved", "rejected"] },
      disabled: false,
    })
      .skip(skip)
      .limit(limit);

    const records = await Leave.find({
      employeeId,
      status: { $in: ["approved", "rejected"] },
      disabled: false,
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "Approved Leave retrieved",
      data: leaves,
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

// Get All History for Admin Leave
async function handleGetAllHistoryLeave(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const leaves = await Leave.find({
      status: { $in: ["approved", "rejected"] },
      disabled: false,
    })
      .skip(skip)
      .limit(limit);

    const records = await Leave.find({
      status: { $in: ["approved", "rejected"] },
      disabled: false,
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "Approved Leave retrieved",
      data: leaves,
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

// project manager history
async function handleAllPmHistory(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  const pm_id = req.query.id || req.user.id;

  try {
    const users = await User.find({ projectManagerId: pm_id });

    let records;

    const allLeave = await Promise.all(
      users.map(async (user) => {
        const leaves = await Leave.find({
          employeeId: user._id,
          status: { $in: ["approved", "rejected"] },
          $nor: [{ approvedBy: ["Admin", "HR"] }],
        })
          .skip(skip)
          .limit(limit);
        records = await Leave.find({
          employeeId: user._id,
          status: { $in: ["approved", "rejected"] },
          $nor: [{ approvedBy: ["Admin", "HR"] }],
        }).countDocuments();
        return leaves;
      })
    );

    const data = allLeave.flat();

    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "All Leave list Retrieved",
      data,
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
      .json({ status: "error", message: "Server error", error: error.message });
  }
}

// Get All Leave Of Whole Month
const handleGetMonthlyLeave = async (req, res) => {
  try {
    const { date, employeeId } = req.query;

    const given_date = date ? new Date(date) : new Date();
    const given_month = given_date.getMonth();
    const given_year = given_date.getFullYear();
    const month = given_month;
    const year = given_year;
    // Create start and end dates for the specified month
    const startdate = new Date(year, month, 1);
    const enddate = new Date(year, month + 1, 1);
    const employee_id = employeeId || req.user.id;

    const leaveData = await Leave.find({
      employeeId: employee_id,
      $or: [
        { fromDate: { $gte: startdate }, fromDate: { $lt: enddate } },
        { toDate: { $gte: startdate }, toDate: { $lt: enddate } },
      ],
      status: "approved",
      disabled: false,
    });

    // Fetch holidays for the specified month
    const holidays = await Holiday.find({
      date: { $gte: startdate, $lt: enddate },
      disabled: false,
    }).select("date");

    // Helper function to generate date range array
    const getDatesInRange = (startDate, endDate) => {
      const dates = [];
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    // check if a date is a holiday
    const isHoliday = (date) => {
      return holidays.some(
        (holiday) =>
          holiday.date.toISOString().split("T")[0] ===
          date.toISOString().split("T")[0]
      );
    };

    // Calculate all leave days within the month
    let allLeaveDays = [];
    leaveData.forEach((leave) => {
      const leaveStartDate = new Date(leave.fromDate);
      const leaveEndDate = new Date(leave.toDate);
      const leaveDays = getDatesInRange(leaveStartDate, leaveEndDate);
      allLeaveDays = [...allLeaveDays, ...leaveDays];
    });

    // Filter the leave days
    let monthlyLeaveDays = allLeaveDays.filter(
      (date) => date >= startdate && date < enddate && !isHoliday(date)
    );

    // Remove duplicate dates
    monthlyLeaveDays = Array.from(
      new Set(monthlyLeaveDays.map((date) => date.toISOString()))
    ).map((date) => new Date(date));

    return res.status(200).json({
      status: "ok",
      message: "Leave list by month retrieved",
      data: monthlyLeaveDays,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
};

// Get All Pending leave only admin and hr
async function handleGetAllPendingLeave(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const pendingLeaves = await Leave.find({
      status: "pending",
      disabled: false,
    })
      .limit(limit) // Apply limit
      .skip(skip) // Apply skip
      .exec();

    const records = await Leave.find({
      status: "pending",
      disabled: false,
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "success",
      message: "All Pending Leave list Retrieved",
      data: pendingLeaves,
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

// Update Leave Status
async function handleUpdateLeaveStatus(req, res) {
  const { leaveId, status } = req.body;

  if (!["pending", "approved", "rejected"].includes(status)) {
    return res.status(400).json({ status: "error", message: "Invalid status" });
  }

  try {
    const leave_data = await Leave.findById(leaveId);

    if (!leave_data) {
      return res
        .status(404)
        .json({ status: "error", message: "Leave request not found" });
    }

    const leave_type = leave_data.leaveType;
    const user_id = leave_data.employeeId;
    const total_leaveDays = await CountLeaveDay(
      leave_data.fromDate,
      leave_data.toDate,
      leave_data.fromSession1,
      leave_data.fromSession2,
      leave_data.endSession1,
      leave_data.endSession2
    );
    const user = await User.findById(user_id);
    const applied_leave_user_role = user.role;
    const login_user_role = req.user.role;

    let projectmanager;

    if (user.projectManagerId) {
      projectmanager = await User.findById(user.projectManagerId);
    }

    if (!user) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    }

    if (applied_leave_user_role === "HR" && login_user_role !== "Admin") {
      return res.status(403).json({
        status: "error",
        message: "Only Admin can approve/reject HR leave applications",
      });
    }

    // Calculation Leave days
    const leaveDays = leave_data.leaveDays;
    if (status === "approved") {
      if (leave_type === "paid" && user.remainingPaidLeave >= total_leaveDays) {
        user.remainingPaidLeave -= leaveDays;
        user.approvedPaidLeave = (user.approvedPaidLeave || 0) + leaveDays;
      } else if (
        leave_type === "sick" &&
        user.remainingSickLeave >= total_leaveDays
      ) {
        user.remainingSickLeave -= leaveDays;
        user.approvedSickLeave = (user.approvedSickLeave || 0) + leaveDays;
      } else if (
        leave_type === "compOff" &&
        user.remainingCompOffLeave >= total_leaveDays
      ) {
        user.remainingCompOffLeave -= leaveDays;
        user.approvedCompOffLeave =
          (user.approvedCompOffLeave || 0) + leaveDays;
      } else if (leave_type === "notPaid") {
        user.notPaidLeave = (user.notPaidLeave || 0) + 1;
      } else {
        let errorMessage = `${user.name} don't have enough ${leave_type} leave remaining`;
        return res.status(400).json({ status: "error", message: errorMessage });
      }

      const update_status =
        login_user_role !== "HR" && login_user_role !== "Admin"
          ? projectmanager.name
          : login_user_role;

      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        { status: status, approvedBy: update_status },
        { new: true }
      );

      user.remainingLeave =
        (user.remainingSickLeave || 0) +
        (user.remainingPaidLeave || 0) +
        (user.remainingCompOffLeave || 0);
      await user.save();

      const total_remaining_Leave = user.remainingLeave;

      return res.status(200).json({
        status: "ok",
        message: "Leave status updated successfully",
        leaveId: leave._id,
        total_Leave: user.totalLeave,
        total_remaining_Leave: total_remaining_Leave,
        remaining_sickLeave: user.remainingSickLeave,
        remaining_paidLeave: user.remainingPaidLeave,
        remaining_compOffLeave: user.remainingCompOffLeave,
      });
    } else {
      const update_status =
        login_user_role !== "HR" && login_user_role !== "Admin"
          ? projectmanager.name
          : login_user_role;

      const leave = await Leave.findByIdAndUpdate(
        leaveId,
        { status: status, approvedBy: update_status },
        { new: true }
      );
      return res.status(200).json({
        status: "ok",
        message: "Your leave request has been rejected",
        data: leave,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Server error", error: error.message });
  }
}

// Get user leaves number
async function handleGetLeaveNumber(req, res) {
  const user_id = req.query.employeeId || req.user.id;
  const user = await User.findById(user_id);

  if (!user) {
    return res
      .status(400)
      .json({ status: "error", message: "No User Found!!" });
  }

  return res.status(200).json({
    status: "ok",
    message: "Total Leave Count",
    total_Leave: user.totalLeave,
    total_remaining_Leave: user.remainingLeave,
    total_sickLeave: user.sickLeave,
    remaining_sickLeave: user.remainingSickLeave,
    total_paidLeave: user.paidLeave,
    remaining_paidLeave: user.remainingPaidLeave,
    total_compOffLeave: user.compOffLeave,
    remaining_compOffLeave: user.remainingCompOffLeave,
    granted_paidLeave: user.approvedPaidLeave,
    granted_CompOffLeave: user.approvedCompOffLeave,
    granted_sickLeave: user.approvedSickLeave ?? 0,
    granted_unpaidLeave: user.notPaidLeave ?? 0,
  });
}

// Get User Details and Leave Details of User On Current Day
async function handleGetUserLeaveDetailsOnDay(req, res) {
  try {
    const leaves = await Leave.find({ status: "approved", disabled: false });
    const todayLeaveDetails = await Promise.all(
      leaves.map(async (leave) => {
        const user = await User.findById(leave.employeeId);
        const todayDate = new Date().setHours(0, 0, 0, 0);
        const fromdate = new Date(leave.fromDate);
        const todate = new Date(leave.toDate);
        if (todayDate >= fromdate && todayDate <= todate) {
          return {
            user_data: user,
            leave_data: leave,
          };
        }
        return null;
      })
    );
    return res.status(200).json({
      status: "success",
      message: "All Pending Leave list Retrieved",
      data: todayLeaveDetails,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error", error });
  }
}

// Get Leave which is assigned to Project Manager
async function handleGetLeaveForProjectManager(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;

  try {
    const projectManagerId = req.query.id || req.user.id;
    const users = await User.find({ projectManagerId });

    let records;

    const leave = await Promise.all(
      users.map(async (user) => {
        const leave_details = await Leave.find({
          employeeId: user._id,
          status: "pending",
          disabled: false,
        })
          .skip(skip)
          .limit(limit);
        records = await Leave.find({
          employeeId: user._id,
          status: "pending",
          disabled: false,
        }).countDocuments();
        return leave_details;
      })
    );

    const final_leave_data = leave.flat();

    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "success",
      message: "All Pending Leave list Retrieved",
      data: final_leave_data,
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
    return res.status(500).json({
      status: "error",
      message: "Internal Server error",
      error,
    });
  }
}

// Delete Leave
async function handleDeleteLeaveData(req, res) {
  try {
    const leaveid = req.query.id;
    const leave_data = await Leave.findById(leaveid);

    if (!leave_data) {
      return res
        .status(404)
        .json({ status: "error", message: "Leave data not found" });
    }

    leave_data.disabled = true;
    await leave_data.save();

    return res.status(200).json({
      code: "200",
      status: "ok",
      message: "Leave SSuccessFully Deleted",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Server error", error: error.message });
  }
}

module.exports = {
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
};
