import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, Link } from "react-router-dom";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("https://server-three-gamma-87.vercel.app/api/v1/user/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        navigate("/signin");
      } else {
        setError(result.message || "Signup failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Sign Up</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <label className="block text-gray-300 mb-1">Username</label>
          <input
            {...register("username")}
            placeholder="Enter username"
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}

          <label className="block text-gray-300 mt-3 mb-1">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter email"
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}

          <label className="block text-gray-300 mt-3 mb-1">Password</label>
          <input
            {...register("password")}
            type="password"
            placeholder="Enter password"
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-blue-400"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <button
            type="submit"
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-md transition"
            disabled={loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
