
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Job = require("../models/Job.js"); // Assuming you have a Job model
const Application = require("../models/Application"); // Assuming you have an Application model

const JWT_SECRET = process.env.JWT_SECRET;

// User Registration
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, company } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword, role, company });
    await newUser.save();

    // Generate JWT Token
    const token = jwt.sign({ userId: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: "1h" });

    res.status(201).json({ msg: "User registered", token, user: newUser });

  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// User Login
const loginUser = async (req, res) => {
  try {
    console.log("📥 Received login request:", req.body); // Log request body

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // Find user by email
    console.log("🔎 Searching for user:", email);
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Check password
    console.log("🔑 Checking password...");
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("❌ Incorrect password");
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT Token
    console.log("🔐 Generating JWT token...");
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("✅ Login successful!");
    res.status(200).json({ msg: "Login successful", token, user });

  } catch (error) {
    console.error("❌ Login Error:", error); // Log the error details
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


//  Get User Profile (Protected Route)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ msg: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.user.userId }); // Fetch jobs posted by the employer
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobseeker: req.user.userId }); // Fetch applications of the jobseeker
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Logout User (Clears token on client-side)
// Logout User - Clears token (Frontend should also remove it)
const logoutUser = (req, res) => {
  try {
    // Ensure the token exists before trying to log out
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized: No user found" });
    }

    // If using cookies for authentication
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });

    // If using JWT-based authentication
    res.status(200).json({ msg: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};


module.exports = { registerUser, loginUser, getUserProfile, logoutUser, getEmployerJobs, getJobApplications };
