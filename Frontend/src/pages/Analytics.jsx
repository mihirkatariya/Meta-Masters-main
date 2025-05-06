import React, { useState, useEffect } from "react";
import axios from "axios";

const Analytics = ({ eventId }) => {
  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState(null);

  const token = localStorage.getItem("token"); // Fetch token for authentication

  useEffect(() => {
    // Fetch event data on mount
    const fetchEventData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setEventData(res.data);
      } catch (err) {
        console.error("Failed to fetch event data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, token]);

  // Handle the download of the PDF file
  const handleDownloadPDF = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/export/pdf`, // The API endpoint
        {
          responseType: "blob", // Expecting a PDF as a binary file
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Create a link element to trigger the download
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(new Blob([response.data]));
      link.href = url;
      link.setAttribute(
        "download",
        `${eventData.name.replace(/\s+/g, "_")}_details.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL after download
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading PDF:", err);
    }
  };

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2 className="text-xl font-bold">Event Analytics</h2>
      <div className="mb-4">
        <p>
          <strong>Event Name:</strong> {eventData.name}
        </p>
        <p>
          <strong>Location:</strong> {eventData.location}
        </p>
        <p>
          <strong>Start Date:</strong>{" "}
          {new Date(eventData.startDate).toDateString()}
        </p>
        <p>
          <strong>End Date:</strong>{" "}
          {new Date(eventData.endDate).toDateString()}
        </p>
      </div>

      {/* Download PDF Button */}
      <button
        onClick={handleDownloadPDF}
        className="btn-primary bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Download Event PDF
      </button>
    </div>
  );
};

export default Analytics;
