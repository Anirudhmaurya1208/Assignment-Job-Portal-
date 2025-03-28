const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createJob, getAllJobs, getJobById, updateJob, deleteJob } = require("../controllers/jobController");

const router = express.Router();

// Public Routes
router.get("/", getAllJobs); // Get all jobs
router.get("/:id", getJobById); // Get a single job by ID

// Protected Routes (Employer Only)
router.post("/", protect, authorizeRoles("employer"), createJob);
router.put("/:id", protect, authorizeRoles("employer"), updateJob);
router.delete("/:id", protect, authorizeRoles("employer"), deleteJob);

module.exports = router;
