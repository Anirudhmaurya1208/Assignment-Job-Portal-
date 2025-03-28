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
    const [jobs, setJobs] = useState<any[]>([]); // For displaying all jobs
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!currentUser || currentUser.role !== 'employer') {
        navigate('/'); // Redirect to homepage if the user is not an employer
      }

      if (id) {
        // If there's an ID in the URL, it means we're updating an existing job
        fetchJobById(id);
      } else {
        // If no ID, we're creating a new job
        setJobDetails({
          title: '',
          description: '',
          company: '',
          location: '',
          type: '',
          category: '',
          salary: '',
          requirements: [''],
        });
      }

      fetchJobs();
    }, [id, currentUser, navigate]);

    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/jobs');
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchJobById = async (jobId: string) => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/jobs/${jobId}`);
        setJobDetails(response.data);
      } catch (error) {
        console.error('Error fetching job by ID:', error);
      } finally {
        setLoading(false);
      }
    };

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

    const handleFormSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      const apiEndpoint = id ? `/api/jobs/${id}` : '/api/jobs';
      const method = id ? 'put' : 'post';

      try {
        setLoading(true);
        const response = await axios[method](apiEndpoint, jobDetails);
        console.log('Job posted successfully:', response.data);
        navigate('/jobs');
      } catch (error) {
        console.error('Error submitting job:', error);
      } finally {
        setLoading(false);
      }
    };

    const handleDeleteJob = async (jobId: string) => {
      try {
        await axios.delete(`/api/jobs/${jobId}`);
        setJobs(jobs.filter((job) => job.id !== jobId));
        console.log('Job deleted successfully');
      } catch (error) {
        console.error('Error deleting job:', error);
      }
    };

    return (
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold mb-6">{id ? 'Update Job' : 'Post a Job'}</h2>

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

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Company</label>
            <input
              type="text"
              name="company"
              value={jobDetails.company}
              onChange={handleInputChange}
              required
              className="p-3 border rounded"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Location</label>
            <input
              type="text"
              name="location"
              value={jobDetails.location}
              onChange={handleInputChange}
              required
              className="p-3 border rounded"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Job Type</label>
            <input
              type="text"
              name="type"
              value={jobDetails.type}
              onChange={handleInputChange}
              required
              className="p-3 border rounded"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Category</label>
            <input
              type="text"
              name="category"
              value={jobDetails.category}
              onChange={handleInputChange}
              required
              className="p-3 border rounded"
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="font-semibold">Salary</label>
            <input
              type="text"
              name="salary"
              value={jobDetails.salary}
              onChange={handleInputChange}
              required
              className="p-3 border rounded"
            />
          </div>

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
                <button
                  type="button"
                  onClick={() => handleRemoveRequirement(index)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddRequirement}
              className="text-blue-600"
            >
              Add Requirement
            </button>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-blue-600 text-white p-3 rounded">
              {loading ? 'Submitting...' : id ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>

        {/* Job Listings */}
        <div className="mt-8">
          <h3 className="text-2xl font-bold">All Jobs</h3>
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h4 className="font-semibold">{job.title}</h4>
                  <p>{job.company}</p>
                </div>
                <div className="flex space-x-4">
                  <button onClick={() => navigate(`/post-job/${job.id}`)} className="text-blue-600">
                    Edit
                  </button>
                  <button onClick={() => handleDeleteJob(job.id)} className="text-red-600">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  export default PostJobPage;
