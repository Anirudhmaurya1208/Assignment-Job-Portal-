import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const token = localStorage.getItem("token"); // Get token

    if (!token) {
      console.error("No token found, already logged out");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token
        },
        credentials: "include", // Ensure cookies are included
      });

      if (response.ok) {
        localStorage.removeItem("token"); // Remove token from storage
        navigate("/login"); //  Redirect to login page
      } else {
        const errorData = await response.json();
        console.error("Logout failed:", errorData.msg);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded">
      Logout
    </button>
  );
};

export default Logout;
