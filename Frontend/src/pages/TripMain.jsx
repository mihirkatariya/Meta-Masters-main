import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaHourglassHalf,
  FaTruck,
  FaDownload,
  FaSave,
  FaFileImport,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ProgressBar from "../components/ProgressBar";
import MemberList from "../components/MemberList";
import ChecklistSection from "../components/ChecklistSection";
import axios from "axios";
import Analytics from "./Analytics";

function TripMain() {
  const { id } = useParams();
  const [eventData, setEventData] = useState(null); // State to store event data
  const [loading, setLoading] = useState(true); // State to track loading
  const [activeTab, setActiveTab] = useState("dashboard");
  const [packedCount, setPackedCount] = useState(0);
  const [unpackedCount, setUnpackedCount] = useState(0);

  const handleChecklistChange = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/checklists/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const checklist = res.data.checklist || [];
      const packed = checklist.filter(
        (item) => item.status === "packed"
      ).length;
      const total = checklist.length;
      setPackedCount(packed);
      setUnpackedCount(total - packed);
    } catch (err) {
      console.error("Failed to refresh checklist counts", err);
    }
  };
  // Fetch event data when the component mounts
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/events/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Event Data:", response.data); // Debugging
        setEventData(response.data); // Set the fetched event data
      } catch (error) {
        console.error("Failed to fetch event data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchEventData();
  }, [id]);

  // Show a loading spinner while fetching data
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Handle case where event data is not found
  if (!eventData) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Event not found.</p>
      </div>
    );
  }

  // Calculate progress percentage
  const progressPercentage = Math.round(
    (eventData.stats.itemsPacked / eventData.stats.totalItems) * 100
  );
  console.log(eventData._id);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div>
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Event Info */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Event Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-500 w-24">
                      Event Type:
                    </span>
                    <span className="text-gray-800">{eventData.type}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-500 w-24">
                      Dates:
                    </span>
                    <div className="flex items-center text-gray-800">
                      <FaCalendarAlt className="text-gray-500 mr-2" />
                      {new Date(
                        eventData.startDate
                      ).toLocaleDateString()} -{" "}
                      {new Date(eventData.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-500 w-24">
                      Location:
                    </span>
                    <div className="flex items-center text-gray-800">
                      <FaMapMarkerAlt className="text-gray-500 mr-2" />
                      {eventData.location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Packing Progress */}
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Packing Progress
                </h2>
                <div className="mb-6">
                  <ProgressBar
                    progress={progressPercentage}
                    label="Overall Packing Progress"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="font-bold text-3xl text-gray-800">
                      {eventData.stats.itemsPacked}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Items Packed
                    </div>
                  </div>
                  <div className="text-center bg-gray-50 rounded-lg p-4">
                    <div className="font-bold text-3xl text-gray-800">
                      {eventData.stats.itemsPending}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Items Pending
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard
                title="Total Items"
                value={eventData.stats.totalItems}
                icon={<FaBoxOpen />}
                color="text-orange-500"
                bgColor="bg-orange-100"
              />
              <StatCard
                title="Packed"
                value={eventData.stats.itemsPacked}
                icon={<FaCheckCircle />}
                color="text-green-500"
                bgColor="bg-green-100"
              />
              <StatCard
                title="Pending"
                value={eventData.stats.itemsPending}
                icon={<FaHourglassHalf />}
                color="text-yellow-500"
                bgColor="bg-yellow-100"
              />
              <StatCard
                title="Delivered"
                value={eventData.stats.itemsDelivered}
                icon={<FaTruck />}
                color="text-blue-500"
                bgColor="bg-blue-100"
              />
            </div>

            {/* Export & Templates */}
            <div className="bg-white rounded-lg shadow p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Export & Templates
              </h2>
              <div className="flex flex-wrap gap-4">
                <button
                  className="btn-secondary flex items-center"
                  onClick={() => (
                    <div>
                      <Analytics eventId={eventData._id} />
                    </div>
                  )}
                >
                  <FaDownload className="mr-2" />
                  Export as PDF
                </button>

                <button className="btn-secondary flex items-center">
                  <FaSave className="mr-2" />
                  Save as Template
                </button>
                <button className="btn-secondary flex items-center">
                  <FaFileImport className="mr-2" />
                  Import from Template
                </button>
              </div>
            </div>

            {/* Member Management */}
            <MemberList eventId={eventData._id} />
          </div>
        );
      case "checklist":
        return (
          <ChecklistSection
            eventId={eventData._id}
            onChecklistUpdate={handleChecklistChange}
          />
        );
      case "settings":
        return (
          <div>
            <button className="btn-primary bg-red-700 flex items-center">
              Delete Trip
            </button>
          </div>
        );
      case "analytics":
        return (
          <div>
            <Analytics eventId={eventData._id} />
          </div>
        );
      default:
        return <div>Content for {activeTab} will be here</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header eventName={eventData.name} />

        <main className="flex-1 overflow-y-auto p-6">
          {/* Tab Navigation */}
          <div className="mb-6 border-b border-gray-200">
            <div className="flex space-x-8">
              {[
                "dashboard",
                "checklist",
                "notifications",
                "analytics",
                "settings",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}

export default TripMain;
