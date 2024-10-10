const express = require("express");
const router = express.Router();
const {
  currentUser,
  getAdmins,
  registerUser,
  loginUser,
  uploadAssignment,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/handleToken");

// Current user information
router.route("/").get(authenticateToken, currentUser);

// Register a new user
router.route("/register").post(registerUser);

// Log in a user
router.route("/login").post(loginUser);

// Upload an assignment, requires authentication
router.route("/upload").post(authenticateToken, uploadAssignment);

// Get a list of admins
router.route("/admin").get(getAdmins);

module.exports = router;
