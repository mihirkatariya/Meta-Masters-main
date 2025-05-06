import React, { useEffect, useState } from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Header = ({ eventName = "Events" }) => {
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode the token to get the user ID
        const decoded = jwtDecode(token);

        // Fetch user details from the backend
        axios
          .get(`${import.meta.env.VITE_API_BASE_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setUserName(response.data.name || "User");
          })
          .catch((error) => {
            console.error("Failed to fetch user details:", error);
          });
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  return (
    <header className="bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-800">{eventName}</h1>
      <div className="flex items-center space-x-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>

        <div className="flex items-center">
          <div className="mr-3 text-right">
            <p className="font-medium text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">user</p>
          </div>
          <FaUserCircle size={36} className="text-primary-600" />
        </div>
      </div>
    </header>
  );
};

export default Header;
