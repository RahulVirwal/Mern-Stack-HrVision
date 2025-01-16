const mongoose = require("mongoose");

const ForgetAttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  attendanceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "attendance",
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  date: {
    type: Date,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  session: {
    type: String,
    required: true,
  },
  approvedBy: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ForgetAttendance = mongoose.model(
  "ForgetAttendance",
  ForgetAttendanceSchema
);

module.exports = ForgetAttendance;
