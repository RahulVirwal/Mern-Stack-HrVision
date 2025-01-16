require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const { connectMongoDB } = require("./connection");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoute.js");
const authRoutes = require("./routes/authRoute.js");
const attendanceRoutes = require("./routes/attendanceRoute.js");
const forgetAttendanceRoutes = require("./routes/forgetattendanceRoute.js");
const leaveRoutes = require("./routes/leaveRoute.js");
const eventRoutes = require("./routes/eventRoute.js");
const holidayRoutes = require("./routes/holidayRoute.js");
const feedbackRoutes = require("./routes/feedbackRoute.js");
const blogRoutes = require("./routes/blogRoute.js");

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.URL;

connectMongoDB(MONGO_URL);

app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/attendance", attendanceRoutes);
app.use("/api/v1/forgetAttendance", forgetAttendanceRoutes);
app.use("/api/v1/leave", leaveRoutes);
app.use("/api/v1/holiday", holidayRoutes);
app.use("/api/v1/event", eventRoutes);
// app.use("/api/v1/feedback", feedbackRoutes);
app.use("/api/v1/blog", blogRoutes);

app.listen(PORT, () => {
  console.log(`Server Run at port ${PORT}`);
});
