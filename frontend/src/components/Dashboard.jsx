import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [balance, setBalance] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersAndBalance = async () => {
      try {
        const response = await fetch("https://payment-backend-rgrx.onrender.com/api/v1/user/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${localStorage.getItem("token")}`, // Add token for authentication
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch data");
        }

        setUsers(result.users);
        setBalance(result.balance);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUsersAndBalance();
  }, []);

  const handleSendMoney = (receiverId, receiverName) => {
    navigate("/send", { state: { receiverId, receiverName } });
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen text-white">
      <h2 className="text-2xl mb-4">Dashboard</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <h3 className="text-xl">Your Balance: <span className="text-green-400">${balance}</span></h3>
      </div>

      <div>
        <h3 className="text-xl mb-2">Users List</h3>
        <ul className="bg-gray-800 p-4 rounded">
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user._id} className="border-b border-gray-700 p-2 flex justify-between items-center">
                <span>{user.username}</span>
                <button
                  onClick={() => handleSendMoney(user._id, user.username)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  Send Money
                </button>
              </li>
            ))
          ) : (
            <p className="text-gray-400">No users found.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
