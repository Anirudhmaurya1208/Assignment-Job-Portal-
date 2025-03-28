const express = require("express");
const { registerUser, loginUser, getUserProfile,logoutUser } = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getEmployerJobs } = require("../controllers/authController");
const { getJobApplications } = require("../controllers/authController"); 
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);
router.post("/logout", protect, logoutUser); 
router.get("/employer/jobs", protect, authorizeRoles("employer"), getEmployerJobs);
router.get("/jobseeker/applications", protect, authorizeRoles("jobseeker"), getJobApplications);
module.exports = router;
