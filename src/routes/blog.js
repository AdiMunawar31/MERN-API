const express = require("express");
const { body } = require("express-validator");
const router = express.Router();
const BlogController = require("../controllers/blog");

// POST => CREATE
router.post(
  "/post",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Input Title Minimum 5 Characters"),
    body("body")
      .isLength({ min: 5 })
      .withMessage("Input Body Minimum 5 Characters"),
  ],
  BlogController.createBlog
);

// GET => READ
router.get("/posts", BlogController.getAllBlog);

// GET => READ by ID
router.get("/post/:postId", BlogController.getBlogById);

// PUT => UPDATE by ID
router.put(
  "/post/:postId",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Input Title Minimum 5 Characters"),
    body("body")
      .isLength({ min: 5 })
      .withMessage("Input Body Minimum 5 Characters"),
  ],
  BlogController.updateBlog
);

// DELETE => DELETE by ID
router.delete("/post/:postId", BlogController.deleteBlog);

module.exports = router;
