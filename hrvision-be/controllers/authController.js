const jwt = require("jsonwebtoken");
const { User, Counter } = require("../model/userModel");

const JWT_SECRET = process.env.SECRETKEY;

// Create a User
async function handleUserSingup(req, res) {
  try {
    console.log("Request body:", req.body);

    // Extract user details from request body
    const {
      name,
      email,
      contact,
      address,
      position,
      password,
      repassword,
      role,
      joining_date,
      experience,
      bod,
      paidLeave,
      sickLeave,
      projectManagerId,
    } = req.body;

    if (
      !name ||
      !email ||
      !contact ||
      !address ||
      !position ||
      !password ||
      !repassword ||
      !role ||
      !joining_date ||
      !experience ||
      !bod
    ) {
      console.log("Missing required fields");
      return res
        .status(400)
        .json({ status: "error", message: "Please Fillup all Required filed" });
    }

    if (password !== repassword) {
      console.log("Passwords do not match");
      return res
        .status(400)
        .json({ status: "error", message: "Please enter same repassword" });
    }

    const dup_email = await User.findOne({ email });
    if (dup_email) {
      console.log("Duplicate email found:", email);
      return res.status(400).json({
        status: "error",
        message: "Please enter different this email is already exist",
      });
    }

    console.log("Generating employee ID");
    const counter = await Counter.findByIdAndUpdate(
      { _id: "employeeId" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    if (!counter || !counter.seq) {
      console.log("Failed to generate employee ID");
      return res.status(500).json({ message: "Failed to generate employeeId" });
    }

    function generateUniqueId(length = 18) {
      return Array.from({ length }, () =>
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(
          Math.floor(Math.random() * 62)
        )
      ).join("");
    }
    const uniqueId = generateUniqueId();
    console.log("Unique ID generated:", uniqueId);

    const total_leaves = Number(sickLeave) + Number(paidLeave);
    const user = await User.create({
      name,
      email,
      contact,
      address,
      position,
      password,
      repassword,
      role,
      joining_date,
      experience,
      paidLeave,
      sickLeave,
      bod,
      employeeId: counter.seq,
      totalLeave: total_leaves,
      remainingLeave: total_leaves,
      remainingSickLeave: sickLeave,
      remainingPaidLeave: paidLeave,
      projectManagerId,
      uniqueId,
    });

    console.log("User created:", user);

    return res.status(200).json({
      status: "ok",
      message: "User successfully signed up",
      data: user,
    });
  } catch (error) {
    console.error("Error during user signup:", error);
    return res.status(500).json({ message: "Internal Server error", error: error.message });
  }
}

// User Login
async function handleUserLogin(req, res) {
  try {
    // Find Login User
    const { email, password, uniqueId } = req.body;

    const userEmail = email.toLowerCase();

    const user = await User.findOne({ email: userEmail });
    if (!user || user.disabled === true) {
      return res
        .status(404)
        .json({ status: "error", message: "User not found" });
    } else if (userEmail != user.email || password != user.password) {
      return res
        .status(400)
        .json({ status: "error", message: "Email and password doesn't match" });
      // } else if (uniqueId != user.uniqueId && user.role !== "Admin") {
      //   return res.status(400).json({
      //     status: "error",
      //     message: "Please login only on your own Device.",
      //   });
    } else {
      // Create the data object to be included in the JWT
      const data = {
        user: {
          id: user._id,
          role: user.role,
          uniqueId: user.uniqueId,
          tokenVersion: user.tokenVersion,
        },
      };

      // Generate a JWT
      const token = jwt.sign(data, JWT_SECRET);
      res.cookie("jwt-token", token);
      return res.json({
        token: token,
        role: user.role,
        ProjectManager: user.projectManager,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error" });
  }
}

module.exports = {
  handleUserSingup,
  handleUserLogin,
};
