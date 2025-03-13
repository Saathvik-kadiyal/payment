import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white relative px-4">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/people-using-mobile-bank-remittance-money_74855-6617.jpg?t=st=1741857313~exp=1741860913~hmac=059370c038264cadf91e776e41223e004ffc4e08c4d1fb500fc72ea12a3b1740&w=996')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 grid gap-6 text-center">
        <div className="grid gap-3">
          <h1 className="text-4xl md:text-5xl font-bold">Fast & Secure Money Transfers</h1>
          <p className="text-lg text-gray-300">
            Transfer money instantly with safety and ease.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link
            to="/signin"
            className="bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 transition text-white font-medium text-center"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="bg-green-500 px-6 py-3 rounded-lg hover:bg-green-600 transition text-white font-medium text-center"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
