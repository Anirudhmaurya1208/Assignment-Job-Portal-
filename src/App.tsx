import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import EmployerDashboard from './pages/EmployerDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import PostJobPage from './pages/PostJobPage';  //  Import PostJobPage

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  // Persist user on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, [setCurrentUser]);

  // Protected Route: Only allow logged-in users
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };

  // Employer-only Route: Only allow employers to post jobs
  const EmployerRoute = ({ children }: { children: React.ReactNode }) => {
    return currentUser && currentUser.role === "employer" ? children : <Navigate to="/login" />;
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            
            {/* Employer Dashboard (Only Employers) */}
            <Route path="/employer/dashboard" element={<EmployerRoute><EmployerDashboard /></EmployerRoute>} />
            
            {/*  Job Seeker Dashboard (Only Logged-in Users) */}
            <Route path="/jobseeker/dashboard" element={<ProtectedRoute><JobSeekerDashboard /></ProtectedRoute>} />
            
            {/*  Post Job (Only Employers) */}
            <Route path="/post-job" element={<EmployerRoute><PostJobPage /></EmployerRoute>} />

            {/*  Redirect logged-in users from login/register */}
            <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
            <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
