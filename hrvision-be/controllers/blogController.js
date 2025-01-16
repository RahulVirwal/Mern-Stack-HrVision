const Blog = require("../model/blogModel");
const { User } = require("../model/userModel");

// Create a blog post
async function handleBlogCreate(req, res) {
  const { title, content } = req.body;

  const employeeId = req.user.id;

  const user = await User.findById(employeeId);

  try {
    const blog = await Blog.create({
      title,
      content,
      author: user.name,
    });

    res.status(200).json({
      status: "ok",
      message: "Blog post created successfully",
      data: blog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Update a blog
async function handleBlogUpdate(req, res) {
  const { id, title, content } = req.body;

  const blog = await Blog.findById(id);

  try {
    if (!blog) {
      return res
        .status(404)
        .json({ status: "error", message: "Blog not found" });
    }

    const updated_blog = await Blog.findByIdAndUpdate(
      id,
      { title, content, updatedAt: Date.now() },
      { new: true }
    );

    res.status(200).json({
      status: "ok",
      message: "Blog post updated successfully",
      data: updated_blog,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Delete a blog
async function handleBlogDelete(req, res) {
  const { id } = req.query;

  try {
    const blog = await Blog.findById(id);

    if (!blog) {
      return res
        .status(404)
        .json({ status: "error", message: "Blog post not found" });
    }

    blog.disabled = true;
    await blog.save();

    res
      .status(200)
      .json({ status: "ok", message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

// Get all blog posts
async function handleGetAllBlog(req, res) {
  try {
    const blogs = await Blog.find({ disabled: false });

    if (!blogs) {
      return res
        .status(404)
        .json({ status: "error", message: "blogs not found" });
    }

    res
      .status(200)
      .json({ status: "ok", message: "Blog List retrieved", data: blogs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}

module.exports = {
  handleBlogCreate,
  handleBlogUpdate,
  handleBlogDelete,
  handleGetAllBlog,
};
