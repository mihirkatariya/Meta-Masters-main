import React from "react";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

function AddTripCard() {
  return (
    <Link to="/new-event">
      <div
        className="bg-blue-50 border-2 border-dashed border-blue-400 rounded-lg p-6 flex flex-col items-center
        justify-center hover:bg-blue-100 transition-colors cursor-pointer h-72"
      >
        <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center mb-4">
          <Plus className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-blue-600 mb-2">Add New Event</h3>
          <p className="text-sm text-gray-500 text-center">
            Click here to create a new event for your group.
          </p>
        </div>
      </div>
    </Link>
  );
}

export default AddTripCard;
