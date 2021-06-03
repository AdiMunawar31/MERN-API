const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth");

// POST => CREATE
router.post("/register", AuthController.register);

module.exports = router;
