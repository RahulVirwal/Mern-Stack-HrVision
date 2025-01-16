const mongoose = require("mongoose");

const LeaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  leaveType: {
    type: String,
    enum: ["paid", "notPaid", "compOff", "sick"],
    required: true,
  },
  fromDate: {
    type: Date,
    required: true,
  },
  toDate: {
    type: Date,
    required: true,
  },
  fromSession1: {
    type: Boolean,
    default: false,
  },
  fromSession2: {
    type: Boolean,
    default: false,
  },
  endSession1: {
    type: Boolean,
    default: false,
  },
  endSession2: {
    type: Boolean,
    default: false,
  },
  contact: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  approvedBy: {
    type: String,
    default: "",
  },
  leaveDays: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Leave = mongoose.model("Leave", LeaveSchema);

module.exports = Leave;
