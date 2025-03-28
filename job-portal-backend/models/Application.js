const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true }, // Job ID
  jobseeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Jobseeker ID
  resume: { type: String, required: true }, // Store resume URL or file path
  status: { type: String, enum: ["Pending", "Accepted", "Rejected"], default: "Pending" },
  appliedAt: { type: Date, default: Date.now }
});

const Application = mongoose.model("Application", applicationSchema);
module.exports = Application;
