const Job = require("../models/Job");

//  Create a new job (Employer Only)
const createJob = async (req, res) => {
  try {
    const { title, description, company, location, salary, category } = req.body;

    if (!title || !description || !company || !location || !salary || !category) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const newJob = new Job({ ...req.body, postedBy: req.user.userId });
    await newJob.save();

    res.status(201).json({ msg: "Job created successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get all jobs (Public)
const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email");
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Get a single job by ID (Public)
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("postedBy", "name email");
    if (!job) return res.status(404).json({ msg: "Job not found" });

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Update a job (Employer Only)
const updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // Only the employer who posted can update
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });

    res.status(200).json({ msg: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

// Delete a job (Employer Only)
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ msg: "Job not found" });

    // Only the employer who posted can delete
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await job.deleteOne();

    res.status(200).json({ msg: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = { createJob, getAllJobs, getJobById, updateJob, deleteJob };
