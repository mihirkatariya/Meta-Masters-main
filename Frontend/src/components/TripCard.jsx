import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaMapMarkerAlt, FaEdit, FaTrash } from "react-icons/fa";

const TripCard = ({ trip, onUpdate, onDelete }) => {
  const navigate = useNavigate();
  const packed = trip.packedItems || 0;
  const pending = trip.pendingItems || 0;
  const totalItems = packed + pending;
  const progress = totalItems ? Math.round((packed / totalItems) * 100) : 0;

  return (
    <div
      className="bg-white shadow-md rounded-xl p-5 border border-gray-200 hover:shadow-lg transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between h-80"
      onClick={() => navigate(`/trip/${trip._id}`)}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{trip.name}</h3>
          <p className="text-sm text-gray-500">Event Type: {trip.type}</p>
        </div>
        <div className="flex gap-2">

    {/* Update Icon */}
    <button
      className="text-blue-500 hover:text-blue-700"
      onClick={(e) => {
        e.stopPropagation();
        onUpdate(trip._id, trip); // Pass the full trip (event) object
      }}
    >

      <FaEdit style={{ fontSize: "1.5rem" }} />
    </button>
    {/* Delete Icon */}
    <button
      className="text-red-500 hover:text-red-700"
      onClick={(e) => {
        e.stopPropagation(); // Prevent card click
        onDelete(trip._id); // Call the delete handler
      }}
    >
      <FaTrash style={{ fontSize: "1.5rem" }} />
    </button>
  </div>
      </div>

      {/* Date & Location */}
      <div className="mt-3 text-sm text-gray-600">
        <div className="flex items-center gap-2 mb-1">
          <FaCalendarAlt className="text-gray-500" />
          <span>
            {new Date(trip.startDate).toLocaleDateString()} -{" "}
            {new Date(trip.endDate).toLocaleDateString()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-gray-500" />
          <span>{trip.location || "Unknown Location"}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-700 mb-1">
          <span>Packing Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-purple-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 text-center text-sm text-gray-700">
        <div>
          <p className="font-bold text-lg">{totalItems}</p>
          <p>Total Items</p>
        </div>
        <div>
          <p className="font-bold text-lg">{packed}</p>
          <p>Packed</p>
        </div>
        <div>
          <p className="font-bold text-lg">{pending}</p>
          <p>Pending</p>
        </div>
      </div>

      {/* View Details */}
      <div className="mt-4 text-center">
        <button
          className="text-blue-400 hover:text-blue-600 font-medium underline"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/trip/${trip._id}`);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default TripCard;

