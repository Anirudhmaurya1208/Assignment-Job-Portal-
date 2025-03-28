
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, User, LogOut } from "lucide-react";
import { useStore } from "../store";

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, currentUser, setCurrentUser } = useStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("No token found, already logged out.");
      setCurrentUser(null);
      navigate("/login");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("token"); // Remove token even if request fails
      setCurrentUser(null); // Update app state
      navigate("/login"); // Redirect
  
      if (!response.ok) {
        console.error("Logout failed:", await response.json());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  
  

  return (
    <nav className={`${isDarkMode ? "dark bg-gray-800" : "bg-white"} shadow-md`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            JobPortal
          </Link>

          <div className="flex items-center space-x-4">
            <Link to="/jobs" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} hover:text-blue-600`}>
              Jobs
            </Link>

            {currentUser ? (
              <>
                <Link
                  to={`/${currentUser.role}/dashboard`}
                  className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} hover:text-blue-600`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 px-3 py-2 rounded text-red-500 hover:text-red-700"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link to="/login" className={`${isDarkMode ? "text-gray-300" : "text-gray-700"} hover:text-blue-600`}>
                Login
              </Link>
            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${isDarkMode ? "bg-gray-700" : "bg-gray-100"}`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
