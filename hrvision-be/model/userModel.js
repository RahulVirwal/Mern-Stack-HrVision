const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  repassword: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Employee", "HR", "Admin"],
    default: "Employee",
  },
  employeeId: {
    type: Number,
    unique: true,
  },
  joining_date: {
    type: Date,
    required: true,
  },
  experience: {
    type: String,
    enum: ["Fresher", "Experience"],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  bod: {
    type: Date,
    required: true,
  },
  projectManagerId: {
    type: String,
    default: "",
  },
  projectManager: {
    type: Boolean,
    default: false,
  },
  paidLeave: {
    type: Number,
    default: 0,
  },
  notPaidLeave: {
    type: Number,
    deault: 0,
  },
  sickLeave: {
    type: Number,
    default: 0,
  },
  compOffLeave: {
    type: Number,
    default: 0,
  },
  totalLeave: {
    type: Number,
    default: 0,
  },
  remainingLeave: {
    type: Number,
    default: 0,
  },
  remainingSickLeave: {
    type: Number,
    default: 0,
  },
  remainingPaidLeave: {
    type: Number,
    default: 0,
  },
  remainingCompOffLeave: {
    type: Number,
    default: 0,
  },
  approvedSickLeave: {
    type: Number,
    default: 0,
  },
  approvedPaidLeave: {
    type: Number,
    default: 0,
  },
  approvedCompOffLeave: {
    type: Number,
    default: 0,
  },
  uniqueId: {
    type: String,
    required: true,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  updateBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const counterSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
    default: "employeeId",
  },
  seq: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model("user", userSchema);
const Counter = mongoose.model("counter", counterSchema);

module.exports = { User, Counter };
