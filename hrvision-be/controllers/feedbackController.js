const Feedback = require("../model/feedbackModel");
const { User } = require("../model/userModel");

// Send Feedback
async function handleApplyFeedback(req, res) {
  try {
    const employeeId = req.user.id;
    const { title, description } = req.body;

    const user = await User.findById(employeeId);

    if (!title || !description) {
      return res
        .status(400)
        .json({ status: "error", message: "Please Fillup all Required filed" });
    }

    const feedback = await Feedback.create({
      employeeId,
      title,
      description,
      createdBy: user.name,
    });
    return res.status(200).json({
      status: "ok",
      message: "Feedback Send successfully",
      data: feedback,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: "error", message: "Internal Server error" });
  }
}

// Get All Feedback
async function handleGetAllFeddback(req, res) {
  const { month, year, page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    let feedbacks, date;
    let records;
    if (month && year) {
      date = month.toString() + year.toString();
    }
    if (!date) {
      feedbacks = await Feedback.find({}).skip(skip).limit(limit);
      records = 0;
    } else {
      const given_date = new Date(date);
      const month = given_date.getMonth();
      const year = given_date.getFullYear();
      // Create start and end dates for the specified month
      const startdate = new Date(year, month, 1);
      const enddate = new Date(year, month + 1, 1);
      feedbacks = await Feedback.find({
        createdAt: { $gte: startdate, $lt: enddate },
      })
        .skip(skip)
        .limit(limit);
      records = await Feedback.find({
        createdAt: { $gte: startdate, $lt: enddate },
      }).countDocuments();
    }

    if (!feedbacks) {
      return res
        .status(400)
        .json({ status: "error", message: "There is no Feedback" });
    }

    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "Feedback Send successfully",
      data: feedbacks,
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
      .json({ status: "error", message: "Internal Server error" });
  }
}

// Get All Feedback of User
async function handleGetUserAllFeedback(req, res) {
  const employeeId = req.query.id || req.user.id;
  const { page = 1, limit = 10 } = req.query;
  let skip = (page - 1) * limit;
  try {
    const feedbacks = await Feedback.find({ employeeId })
      .skip(skip)
      .limit(limit);

    if (!feedbacks) {
      return res
        .status(400)
        .json({ status: "error", message: "There is no Feedback" });
    }

    const records = await Feedback.find({ employeeId }).countDocuments();
    const pages = Math.ceil(records / limit);

    return res.status(200).json({
      status: "ok",
      message: "Feedback Send successfully",
      data: feedbacks,
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
      .json({ status: "error", message: "Internal Server error" });
  }
}

module.exports = {
  handleApplyFeedback,
  handleGetAllFeddback,
  handleGetUserAllFeedback,
};
