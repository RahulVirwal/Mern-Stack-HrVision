const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  signInTime1: {
    type: Date,
    default: null,
  },
  signOutTime1: {
    type: Date,
    default: null,
  },
  signInTime2: {
    type: Date,
    default: null,
  },
  signOutTime2: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Attendance = mongoose.model("Attendance", AttendanceSchema);

module.exports = Attendance;
