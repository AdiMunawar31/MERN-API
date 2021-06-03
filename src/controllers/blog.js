const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs");
const BlogPost = require("../models/blog");

// POST
// =====================================================================================================================
exports.createBlog = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image must be uploaded!");
    err.errorStatus = 422;
    err.data = errors.array();
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;

  const Posting = new BlogPost({
    title: title,
    body: body,
    image: image,
    author: {
      uid: 1,
      name: "Munawarrr",
    },
  });

  Posting.save()
    .then(result => {
      res
        .status(201)
        .json({ message: "Create Blog Succesfully", data: result });
    })
    .catch(err => console.log("err : ", err));
};

// GET
// =====================================================================================================================
exports.getAllBlog = (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = req.query.perPage || 5;
  let totalItems;

  BlogPost.find()
    .countDocuments()
    .then(count => {
      totalItems = count;
      return BlogPost.find()
        .skip((parseInt(currentPage) - 1) * parseInt(perPage))
        .limit(parseInt(perPage));
    })
    .then(result => {
      res.status(200).json({
        message: "Get data Blog Post Success",
        data: result,
        total_data: totalItems,
        current_page: parseInt(currentPage),
        per_page: parseInt(perPage),
      });
    })
    .catch(err => next(err));
};

// DETAIL
// =====================================================================================================================
exports.getBlogById = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then(result => {
      if (!result) {
        const err = new Error("Blog Post Not Found!");
        err.errorStatus = 404;
        throw err;
      }
      res.status(200).json({
        message: "Get data Blog Post Success",
        data: result,
      });
    })
    .catch(err => next(err));
};

// PUT
// =====================================================================================================================
exports.updateBlog = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new Error("Invalid Value");
    err.errorStatus = 400;
    err.data = errors.array();
    throw err;
  }

  if (!req.file) {
    const err = new Error("Image must be uploaded!");
    err.errorStatus = 422;
    err.data = errors.array();
    throw err;
  }

  const title = req.body.title;
  const image = req.file.path;
  const body = req.body.body;
  const postId = req.params.postId;

  BlogPost.findById(postId)
    .then(post => {
      if (!post) {
        const err = new Error("Blog Post Not Found!");
        err.errorStatus = 404;
        throw err;
      }

      post.title = title;
      post.image = image;
      post.body = body;

      return post.save();
    })
    .then(result => {
      res.status(200).json({
        message: "Update Blog Post Success",
        data: result,
      });
    })
    .catch(err => next(err));
};

// DELETE
// =====================================================================================================================
exports.deleteBlog = (req, res, next) => {
  const postId = req.params.postId;
  BlogPost.findById(postId)
    .then(post => {
      if (!post) {
        const err = new Error("Blog Post Not Found!");
        err.errorStatus = 404;
        throw err;
      }

      removeImage(post.image);
      return BlogPost.findByIdAndRemove(postId);
    })
    .then(result => {
      res.status(200).json({
        message: "Deleted Blog Post Success",
        data: result,
      });
    })
    .catch(err => next(err));
};

const removeImage = filePath => {
  console.log("path", filePath);
  filePath = path.join(__dirname, "../..", filePath);
  fs.unlink(filePath, err => console.log(err));
};
