import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import TripCard from "../components/TripCard";
import AddTripCard from "../components/AddTripCard";
import axios from "axios";
import { ThreeDot } from "react-loading-indicators";
import { useNavigate } from "react-router-dom";

function OwnerDashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/events`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTrips(response.data); // Set the fetched trips
      } catch (error) {
        console.error("Failed to fetch trips:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  const handleDelete = async (tripId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/events/${tripId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("deleted successfully ");
      // Remove the trip from the state
      setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== tripId));
    } catch (error) {
      console.error("Failed to delete trip:", error);
      alert("Failed to delete trip. Please try again.");
    }
  };

  const handleTripAdded = (newTrip) => {
    // Add the new trip to the list of trips
    setTrips([...trips, newTrip]);
  };

  const handleUpdate = async (tripId, event) => {
    try {
      console.log("Update trip:", tripId);

      navigate("/new-event", { state: { editEvent: event } });
    } catch (error) {
      console.error("Update failed:", error);
      alert("Failed to update event.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <ThreeDot color="#675fe0" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="grid grid-cols-3 gap-2 overflow-y-auto p-6">
          {/* Render existing trips */}
          {trips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}

          {/* AddTripCard after the existing trips */}
          <div className="mb-6">
            <AddTripCard onTripAdded={handleTripAdded} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default OwnerDashboard;
