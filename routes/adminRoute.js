const express = require("express");
const router = express.Router();
const {
  currentAdmin,
  registerAdmin,
  loginAdmin,
  viewAssignments,
  acceptAssignment,
  rejectAssignment,
} = require("../controllers/adminController");
const { authenticateToken } = require("../middleware/handleToken");

// Current admin information
router.route("/").get(authenticateToken, currentAdmin);

// Admin registration route
router.route("/register").post(registerAdmin);

// Admin login route
router.route("/login").post(loginAdmin);

// Get assignments for the admin
router.route("/assignments").get(authenticateToken, viewAssignments);

// Accept assignment
router
  .route("/assignments/:id/accept")
  .post(authenticateToken, acceptAssignment);

// Reject assignment
router
  .route("/assignments/:id/reject")
  .post(authenticateToken, rejectAssignment);

module.exports = router;
