const User = require("../models/userModel");
const Assignment = require("../models/assignmentModel");
const bcrypt = require("bcrypt");
const {
  generateToken,
  authenticateToken,
} = require("../middleware/handleToken");

// Get current user information
const currentUser = async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username }).select("-password");

    if (!user || user.role !== "user") {
      return res.status(403).json({ message: "No user found." });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

// Register a new user
const registerUser = async (req, res) => {
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

    const user = await User.create({
      name,
      username,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user || user.role !== "user") {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const jwt_token = generateToken(user);

    res.status(200).json({ message: "Login successful", jwt_token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Upload an assignment and associate it with an admin
const uploadAssignment = async (req, res) => {
  try {
    const { adminId, task } = req.body;

    if (!adminId || !task) {
      return res.status(400).json({ message: "All fields are mandatory!" });
    }

    const admin = await User.findOne({ username: adminId, role: "admin" });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    const username = req.user.username;
    const user = await User.findOne({ username, role: "user" });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const assignment = await Assignment.create({
      userId: user._id,
      task,
      adminId: admin._id,
    });

    return res.status(201).json({
      message: "Assignment uploaded successfully.",
      assignment: {
        userId: user.username,
        task: assignment.task,
        adminId: admin.username,
        status: assignment.status,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Get list of all admins
const getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });

    if (admins.length === 0) {
      return res.status(200).json({ message: "No admins found." });
    }

    const adminList = admins.map((admin) => ({
      id: admin.id,
      username: admin.username,
      name: admin.name,
    }));

    return res.status(200).json({ admins: adminList });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error.", error: error.message });
  }
};

module.exports = {
  currentUser,
  getAdmins,
  registerUser,
  loginUser,
  uploadAssignment,
};
