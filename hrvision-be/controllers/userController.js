const { User } = require("../model/userModel");

// Update user
async function handleUpdateuser(req, res) {
  try {
    const {
      id,
      name,
      email,
      contact,
      address,
      position,
      password,
      repassword,
      role,
      experience,
      paidLeave = 0,
      sickLeave = 0,
      compOffLeave = 0,
      joining_date,
      bod,
      projectManagerId,
      projectManager,
      uniqueId,
    } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not Found" });
    }

    if (uniqueId !== user.uniqueId) {
      const userUniqueID = await User.findOne({ uniqueId });

      if (userUniqueID) {
        return res.status(400).json({
          status: "error",
          message: "This unique id already exists.",
        });
      }
    }

    const update_user_role = user.role;
    const login_user_role = req.user.role;

    if (update_user_role === "HR" && login_user_role !== "Admin") {
      return res.status(403).json({
        status: "error",
        message: "Only Admin can updated of HR profile",
      });
    }

    let updatedProjectManagerId = projectManagerId;

    // Check if the user is a project manager
    if (projectManager) {
      updatedProjectManagerId = "";
    }
    // Ensure approved leaves are numbers
    const approvedSickLeave = user.approvedSickLeave || 0;
    const approvedPaidLeave = user.approvedPaidLeave || 0;
    const approvedCompOffLeave = user.approvedCompOffLeave || 0;

    // Calculate leave balances
    const user_totalLeave = sickLeave + paidLeave + compOffLeave;
    const user_remainingSickLeave = sickLeave - approvedSickLeave;
    const user_remainingPaidLeave = paidLeave - approvedPaidLeave;
    const user_remainingCompOffLeave = compOffLeave - approvedCompOffLeave;
    const user_remainingLeave =
      user_remainingSickLeave +
      user_remainingPaidLeave +
      user_remainingCompOffLeave;

    // Check for negative leave balances
    if (
      user_totalLeave < 0 ||
      user_remainingSickLeave < 0 ||
      user_remainingPaidLeave < 0 ||
      user_remainingCompOffLeave < 0 ||
      user_remainingLeave < 0
    ) {
      return res
        .status(400)
        .json({ status: "error", message: "Leave balance cannot be negative" });
    }

    // Update user
    const updateData = {
      name,
      email,
      contact,
      address,
      position,
      role,
      experience,
      paidLeave,
      sickLeave,
      compOffLeave,
      totalLeave: user_totalLeave,
      remainingSickLeave: user_remainingSickLeave,
      remainingPaidLeave: user_remainingPaidLeave,
      remainingCompOffLeave: user_remainingCompOffLeave,
      remainingLeave: user_remainingLeave,
      joining_date,
      bod,
      projectManagerId: updatedProjectManagerId,
      projectManager,
      uniqueId,
      updateBy: req.user.role,
    };

    if (password !== user.password && password === repassword) {
      updateData.password = password;
      updateData.repassword = repassword;
      updateData.tokenVersion = user.tokenVersion + 1;
    }

    const data = await User.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(201).json({
      code: "201",
      status: "ok",
      message: "Updated Successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

// Delete user
async function handleDeleteuser(req, res) {
  try {
    const { employeeId } = req.query;
    const user = await User.findById(employeeId);
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", message: "User not Found" });
    }
    // Disables true
    user.disabled = true;
    await user.save();
    return res
      .status(200)
      .json({ code: "200", status: "ok", message: "SuccessFully Delete User" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server error" });
  }
}

// get All user
async function handleGetAllUsers(req, res) {
  // const { page = 1, limit = 20 } = req.query;
  const page = 1 , limit = 20 ;
  let skip = (page - 1) * limit;
  try {
    const users = await User.find({
      disabled: false,
      $nor: [{ role: "Admin" }],
    })
      .skip(skip)
      .limit(limit)
      .select("-password -repassword")
      .exec();
    if (!users) {
      return res
        .status(400)
        .json({ status: "error", message: "Users not Found" });
    }
    const records = users.length;
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      code: "200",
      status: "ok",
      message: "Users list retrieved",
      data: users,
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
    return res.status(500).json({ message: "Internal Server error" });
  }
}

// Get user
async function handleGetUser(req, res) {
  try {
    const userId = req.query.employeeId || req.user.id;
    const login_user = await User.findById(userId);
    if (!login_user) {
      return res
        .status(400)
        .json({ status: "error", message: "Login User not Found" });
    }
    return res.status(200).json({
      code: "200",
      status: "ok",
      message: "User retrieved",
      data: login_user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", Message: "Internal Server error" });
  }
}

// Get Project Manager
async function handleGetProjectManager(req, res) {
  try {
    const projectManagers = await User.find({ projectManager: true });
    if (!projectManagers) {
      return res
        .status(400)
        .json({ status: "error", message: "Project Manager not Found" });
    }
    return res.status(200).json({
      code: "200",
      status: "ok",
      message: "Users list retrieved",
      data: projectManagers,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", Message: "Internal Server error" });
  }
}

// Get Delete user
async function handleGetDeleteUser(req, res) {
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const users = await User.find({
      disabled: true,
      $nor: [{ role: "Admin" }],
    })
      .skip(skip)
      .limit(limit)
      .select("-password -repassword")
      .exec();
    if (!users) {
      return res
        .status(400)
        .json({ status: "error", message: "Users not Found" });
    }

    const records = await User.find({
      disabled: true,
      $nor: [{ role: "Admin" }],
    }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      code: "200",
      status: "ok",
      message: "Disable users list retrieved",
      data: users,
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
    return res.status(500).json({ message: "Internal Server error" });
  }
}

module.exports = {
  handleUpdateuser,
  handleDeleteuser,
  handleGetAllUsers,
  handleGetUser,
  handleGetProjectManager,
  handleGetDeleteUser,
};
