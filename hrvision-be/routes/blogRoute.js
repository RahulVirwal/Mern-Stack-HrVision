const express = require("express");
const { fetchuser, restrictTo } = require("../middlewares/auth");
const {
  handleBlogCreate,
  handleBlogUpdate,
  handleGetAllBlog,
  handleBlogDelete,
} = require("../controllers/blogController");

const router = express.Router();

router.post("/", fetchuser, handleBlogCreate);
router.put("/", fetchuser, handleBlogUpdate);
router.get("/", fetchuser, handleGetAllBlog);
router.delete("/", fetchuser, handleBlogDelete);

module.exports = router;
