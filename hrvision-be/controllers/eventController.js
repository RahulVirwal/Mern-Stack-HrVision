const Event = require("../model/eventModel");
const fs = require("fs");
const path = require("path");
const convertImagesToBase64 = require("../utils/convertImagesToBase64");
// Create an event
async function handleEventCreate(req, res) {
  const { date, title, description } = req.body;

  try {
    if (!date || !title || !description) {
      return res
        .status(400)
        .json({ status: "error", message: "Please give me required all fill" });
    }

    let event = await Event.create({
      date,
      title,
      description,
      image: null,
      createdBy: req.user.role,
    });

    if (req.file) {
      // Extract the file extension
      const imagePath = req.file.path;

      const fileExtension = path.extname(req.file.originalname);

      // Rename the file with the event ID
      const newFilename = `${event._id}${fileExtension}`;
      const newPath = path.join("static/events", newFilename);

      await fs.promises.rename(imagePath, newPath);

      // Update the event with the new image path
      event.image = newPath;
      await event.save();
    }

    res.status(200).json({
      status: "ok",
      message: "Event created successfully",
      data: event,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Update an event
async function handleEventUpdate(req, res) {
  const { id, title, description } = req.body;

  const event = await Event.findById(id);

  let imagePath;

  if (!req.file) {
    imagePath = event.image;
  } else {
    imagePath = req.file.path;
  }

  try {
    if (event) {
      let newImagePath = event.image;

      if (req.file) {
        // If there's an old image, delete it
        if (newImagePath) {
          await fs.unlinkSync(event.image);
        }

        const fileExtension = path.extname(req.file.originalname);
        newImagePath = path.join(
          "static/events",
          `${event._id}${fileExtension}`
        );
        fs.renameSync(imagePath, newImagePath);
      }
      let newEvent = {
        title,
        description,
        image: newImagePath,
      };
      const updateEvent = await Event.findByIdAndUpdate(
        id,
        { $set: newEvent },
        { new: true }
      );
      res.status(200).json({
        status: "ok",
        message: "Event updated successfully",
        data: updateEvent,
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Event not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Delete an event
async function handleEventDelete(req, res) {
  const { id } = req.query;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const imagePath = event.image;

    event.disabled = true;
    await event.save();

    if (imagePath) {
      fs.unlink(imagePath, (err) => {
        if (err) {
          console.error("Failed to delete file:", err);
        }
      });
    }

    res
      .status(200)
      .json({ status: "ok", message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Get All Event
async function handleAllEventGet(req, res) {
  const { page = 1, limit = 10, sortOrder = 'desc' } = req.query;
  let skip = (page - 1) * limit;

  // Determine the sort direction (default to descending)
  const sortDirection = sortOrder.toLowerCase() === 'asc' ? 1 : -1;

  try {
    const events = await Event.find({ disabled: false })
      .lean()
      .sort({ date: sortDirection }) // This will default to descending order
      .skip(skip)
      .limit(limit);

    if (!events || events.length === 0) {
      return res.status(404).json({ message: "No events found" });
    }

    // Convert images to Base64
    const imagesBase64 = await convertImagesToBase64(
      events.map((event) => event.image)
    );

    const results = events.map((event, index) => ({
      ...event,
      image: imagesBase64[index],
    }));

    const totalRecords = await Event.countDocuments({ disabled: false });
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).json({
      status: "ok",
      message: "Event List retrieved",
      data: results,
      pagination: {
        current: Number(page),
        limit: Number(limit),
        next: {
          page: Number(page) < totalPages ? Number(page) + 1 : null,
          limit: Number(limit),
        },
        pages: totalPages,
        records: totalRecords,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

// Get Event by Date
async function handleEventGetByDate(req, res) {
  try {
    const today = new Date();
    const { date = today } = req.query;
    const start = new Date(date);

    const startOfDay = new Date(start).setHours(0, 0, 0, 0);
    const endOfDay = new Date(start).setHours(23, 59, 59, 999);

    const event = await Event.find({
      disabled: false,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    // Convert images to Base64
    const imagesBase64 = await convertImagesToBase64(
      event.map((event) => event.image)
    );

    const results = event.map((event, index) => ({
      ...event._doc,
      image: imagesBase64[index],
    }));

    return res
      .status(200)
      .json({ status: "ok", message: "Event Retrieved", data: results });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Server error", error });
  }
}

module.exports = {
  handleEventCreate,
  handleEventUpdate,
  handleEventDelete,
  handleAllEventGet,
  handleEventGetByDate,
};
