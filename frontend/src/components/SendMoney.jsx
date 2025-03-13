import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SendMoney = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { receiverId, receiverName } = location.state || {};
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  if (!receiverId) {
    return <p className="text-red-500 text-center mt-10">Invalid user selected.</p>;
  }

  const handleTransfer = async (e) => {
    e.preventDefault();

    if (amount <= 0) {
      setMessage("Enter a valid amount!");
      return;
    }

    try {
      const response = await fetch("https://payment-f9b1.vercel.app/api/v1/account/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: Number(amount), to: receiverId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Transfer failed");
      }

      setMessage("✅ Money sent successfully!");
      setAmount("");

      // Redirect back after 2 seconds
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Send Money</h2>

        {/* Receiver Info */}
        <div className="bg-gray-700 p-4 rounded-md text-center">
          <h3 className="text-xl font-bold text-green-400">{receiverName}</h3>
        </div>

        {/* Transfer Form */}
        <form onSubmit={handleTransfer} className="mt-4">
          <label className="block text-gray-300 mb-1">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring focus:ring-green-400"
            placeholder="Enter amount"
            required
          />

          <button
            type="submit"
            className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-md transition"
          >
            Send Money
          </button>
        </form>

        {/* Message */}
        {message && <p className="mt-4 text-center">{message}</p>}
      </div>
    </div>
  );
};

export default SendMoney;