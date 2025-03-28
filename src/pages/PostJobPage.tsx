import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useStore } from '../store';



function PostJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser); // Get current user info
  
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    type: '',
    category: '',
    salary: '',
    requirements: [''],
  });

  const [jobs, setJobs] = useState<any[]>([]); // Ensure jobs is always an array
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'employer') {
      navigate('/'); // Redirect to homepage if the user is not an employer
    }

    if (id) {
      fetchJobById(id);
    }

    fetchJobs();
  }, [id, currentUser, navigate]);

  // Fetch all jobs
  const fetchJobs = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/jobs", jobDetails);
      setJobs(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]); // Fallback to an empty array
    }
  };

  // Fetch a specific job by ID
  const fetchJobById = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/jobs/${jobId}`);
      setJobDetails(response.data || {
        title: '',
        description: '',
        company: '',
        location: '',
        type: '',
        category: '',
        salary: '',
        requirements: [''],
      });
    } catch (error) {
      console.error('Error fetching job by ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setJobDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDetails((prevState) => ({
      ...prevState,
      description: e.target.value,
    }));
  };

  const handleRequirementsChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newRequirements = [...jobDetails.requirements];
    newRequirements[index] = e.target.value;
    setJobDetails((prevState) => ({
      ...prevState,
      requirements: newRequirements,
    }));
  };

  const handleAddRequirement = () => {
    setJobDetails((prevState) => ({
      ...prevState,
      requirements: [...prevState.requirements, ''],
    }));
  };

  const handleRemoveRequirement = (index: number) => {
    const newRequirements = jobDetails.requirements.filter((_, i) => i !== index);
    setJobDetails((prevState) => ({
      ...prevState,
      requirements: newRequirements,
    }));
  };

  // Handle job submission (Create/Update)
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const apiEndpoint = id ? `/api/jobs/${id}` : '/api/jobs';
    const method = id ? 'put' : 'post';

    try {
      setLoading(true);
      await axios[method](apiEndpoint, jobDetails);
      navigate('/jobs');
    } catch (error) {
      console.error('Error submitting job:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    try {
      await axios.delete(`/api/jobs/${jobId}`);
      setJobs(jobs.filter((job) => job._id !== jobId));
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">{id ? 'Update Job' : 'Post a Job'}</h2>

      {/* Job Form */}
      <form onSubmit={handleFormSubmit} className="space-y-6">
        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Job Title</label>
          <input
            type="text"
            name="title"
            value={jobDetails.title}
            onChange={handleInputChange}
            required
            className="p-3 border rounded"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="font-semibold">Description</label>
          <textarea
            name="description"
            value={jobDetails.description}
            onChange={handleDescriptionChange}
            required
            className="p-3 border rounded"
          />
        </div>

        {/* Other Job Fields */}
        {['company', 'location', 'type', 'category', 'salary'].map((field) => (
          <div key={field} className="flex flex-col space-y-2">
            <label className="font-semibold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={jobDetails[field as keyof typeof jobDetails]}
              onChange={handleInputChange}
              required
              className="p-3 border rounded"
            />
          </div>
        ))}

        {/* Job Requirements */}
        <div>
          <label className="font-semibold">Requirements</label>
          {jobDetails.requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementsChange(e, index)}
                className="p-3 border rounded w-full"
              />
              <button type="button" onClick={() => handleRemoveRequirement(index)} className="text-red-600">
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={handleAddRequirement} className="text-blue-600">
            Add Requirement
          </button>
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-blue-600 text-white p-3 rounded">
          {loading ? 'Submitting...' : id ? 'Update Job' : 'Post Job'}
        </button>
      </form>

      {/* Job Listings */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold">All Jobs</h3>
        {jobs.length === 0 ? (
          <p>No job listings found.</p>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job._id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p>{job.company}</p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => navigate(`/post-job/${job._id}`)} className="text-blue-600">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteJob(job._id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PostJobPage;
