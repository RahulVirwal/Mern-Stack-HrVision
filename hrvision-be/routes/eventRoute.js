const express = require("express");
const {
  handleEventCreate,
  handleEventUpdate,
  handleEventDelete,
  handleAllEventGet,
  handleEventGetByDate,
} = require("../controllers/eventController.js");
const { fetchuser, restrictTo } = require("../middlewares/auth.js");
const multer = require("multer");
const fs = require("fs");

// Image Upload Functionality
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dest = "static/events";
    fs.mkdir(dest, { recursive: true }, (err) => {
      if (err) throw err;
      cb(null, dest);
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.post(
  "/",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  upload.single("image"),
  handleEventCreate
);
router.put(
  "/",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  upload.single("image"),
  handleEventUpdate
);
router.delete(
  "/",
  fetchuser,
  restrictTo(["Admin", "HR"]),
  upload.none(),
  handleEventDelete
);

router.get("/bydate", fetchuser, upload.none(), handleEventGetByDate);

router.get("/all", fetchuser, upload.none(), handleAllEventGet);
module.exports = router;
