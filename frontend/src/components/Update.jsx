import React, { useState } from "react";

const Update = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const response = await fetch("https://payment-xi-five.vercel.app/api/v1/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(
          Object.fromEntries(Object.entries(formData).filter(([_, v]) => v)) // Remove empty fields
        ),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Update failed");

      setMessage({ text: "Profile updated successfully!", type: "success" });
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h2 className="text-2xl mb-4">Update Profile</h2>

      {message.text && (
        <p className={`mb-4 ${message.type === "error" ? "text-red-400" : "text-green-400"}`}>
          {message.text}
        </p>
      )}

      <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
        {["username", "email", "password"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block mb-2 capitalize">{field}</label>
            <input
              type={field === "password" ? "password" : "text"}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-white rounded"
            />
          </div>
        ))}

        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`w-full p-2 rounded ${loading ? "bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default Update;
