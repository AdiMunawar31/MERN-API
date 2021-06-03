const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const app = express();
const AuthRoutes = require("./src/routes/auth");
const BlogRoutes = require("./src/routes/blog");

// MULTER
// =====================================================================================================================
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

// BODY PARSER
// =====================================================================================================================
app.use(bodyParser.json());

// EXPRESS ROUTES
// =====================================================================================================================
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,  Authorization");
  next();
});

app.use("/v1/auth", AuthRoutes);
app.use("/v1/blog", BlogRoutes);

app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

// MONGO DB
// =====================================================================================================================
mongoose
  .connect(
    "mongodb+srv://d2y:LwDMa23MV3uxJPtm@cluster0.qkwmw.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(process.env.PORT || 4000, () =>
      console.log(
        "============================ Connection Success =============================="
      )
    );
  })
  .catch((err) => console.log(err));
