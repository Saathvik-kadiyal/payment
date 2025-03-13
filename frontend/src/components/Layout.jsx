import React, { useEffect, useState, useCallback } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")) || null);
  const [loading, setLoading] = useState(!user); // If user exists, avoid initial loading state
  const [error, setError] = useState("");
  const [balance, setBalance] = useState(0);

  // Fetch user details once and store in localStorage
  useEffect(() => {
    if (user) return; // Skip fetching if user exists

    const fetchUser = async () => {
      try {
        const response = await fetch("https://payment-f9b1.vercel.app/api/v1/user/details", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`,
          },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || "Failed to fetch user data");

        localStorage.setItem("user", JSON.stringify(result)); // Store user in localStorage
        setUser(result);
      } catch (err) {
        setError(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/signin");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [user, navigate]);

  // Fetch balance separately (only when needed)
  const fetchBalance = useCallback(async () => {
    try {
      const response = await fetch("https://payment-f9b1.vercel.app/pi/v1/account/balance", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to fetch balance");

      setBalance(result.balance);
    } catch (err) {
      console.error("Error fetching balance:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 p-4 flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer hover:text-gray-400 transition"
          onClick={() => navigate("/dashboard")}
        >
          {loading ? "Loading..." : error ? "Error" : user?.username}
        </h1>

        <div className="flex gap-4">
          <Link to="/update" className="bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-all">
            Settings
          </Link>
          <button onClick={handleLogout} className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition-all">
            Logout
          </button>
        </div>
      </nav>

      <div className="flex-1 p-6">
        {/* Pass user details & balance only where needed */}
        <Outlet context={{ user, balance, fetchBalance }} />
      </div>
    </div>
  );
};

export default Layout;
