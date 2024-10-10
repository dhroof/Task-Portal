const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");
const bcrypt = require("bcrypt");
const {
  generateToken,
  authenticateToken,
} = require("../middleware/handleToken");

// Get current admin information
const currentAdmin = async (req, res) => {
  try {
    const username = req.user.username;
    const admin = await User.findOne({ username }).select("-password");

    if (!admin || admin.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Forbidden: Admin access required" });
    }

    res.json(admin);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// Register a new admin
const registerAdmin = async (req, res) => {
  const { name, username, password } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }

  try {
    const userAvailable = await User.findOne({ username });
    if (userAvailable) {
      return res.status(409).json({ message: "User already exists!" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const admin = await User.create({
      name,
      username,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      admin: {
        id: admin.id,
        username: admin.username,
        name: admin.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// Admin login
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }

  try {
    const admin = await User.findOne({ username });
    if (!admin || admin.role !== "admin") {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, admin.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const jwt_token = generateToken(admin);

    res.status(200).json({ message: "Login successful", jwt_token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// View assignments assigned to the current admin
const viewAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      adminId: req.user.id,
    })
      .populate("userId", "username")
      .populate("adminId", "username");

    if (!assignments || assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found." });
    }

    const formattedAssignments = assignments.map((assignment) => ({
      id: assignment.id,
      userId: assignment.userId.username,
      task: assignment.task,
      adminId: assignment.adminId.username,
      status: assignment.status,
      date: assignment.createdAt,
    }));

    return res.status(200).json({
      assignments: formattedAssignments,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching assignments", error: error.message });
  }
};

// Accept an assignment by ID
const acceptAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { status: "accepted" },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.json({ message: "Assignment accepted", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error accepting assignment", error: error.message });
  }
};

// Reject an assignment by ID
const rejectAssignment = async (req, res) => {
  try {
    const assignmentId = req.params.id;

    const assignment = await Assignment.findByIdAndUpdate(
      assignmentId,
      { status: "rejected" },
      { new: true }
    );

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found." });
    }

    res.json({ message: "Assignment rejected", assignment });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error rejecting assignment", error: error.message });
  }
};

module.exports = {
  currentAdmin,
  registerAdmin,
  loginAdmin,
  viewAssignments,
  acceptAssignment,
  rejectAssignment,
};
