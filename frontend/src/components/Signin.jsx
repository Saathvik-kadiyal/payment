import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://payment-xi-five.vercel.app/api/v1/user/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Handle non-JSON errors
        throw new Error(errorText || "Signin failed");
      }
  
      const result = await response.json();
      console.log("Signin Success:", result); // Debugging
  
      localStorage.setItem("token", `Bearer ${result.token}`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signin Error:", err.message);
      setMessage(`❌ ${err.message}`);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign In</h2>

        <form onSubmit={handleSubmit} className="mt-4">
          <label className="block text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Enter email"
            required
          />

          <label className="block text-gray-300 mt-3 mb-1">Password</label>
          <input
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400"
            placeholder="Enter password"
            required
          />

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition"
          >
            Sign In
          </button>
        </form>

        {message && <p className="mt-4 text-center">{message}</p>}

        <p className="mt-4 text-center text-gray-400">
          New here?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
