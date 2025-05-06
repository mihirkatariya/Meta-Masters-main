import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";

const ChecklistSection = ({ eventId, onChecklistUpdate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [newItem, setNewItem] = useState({ name: "", quantity: 1 });

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchChecklist = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/checklists/${eventId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setItems(res.data.checklist || []);
        setRole(res.data.role);
      } catch (err) {
        console.error("Failed to fetch checklist:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChecklist();
  }, [eventId, onChecklistUpdate]);

  const handleAddItem = async () => {
    if (!newItem.name.trim()) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/checklists/${eventId}/categories`, // replace with your actual POST route
        { name: newItem.name, quantity: newItem.quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) => [...prev, res.data]);
      setNewItem({ name: "", quantity: 1 });
      if (onChecklistUpdate) onChecklistUpdate();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/checklists/${eventId}/items/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) => prev.filter((item) => item._id !== itemId));
      if (onChecklistUpdate) onChecklistUpdate();
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleStatusChange = async (itemId, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/checklists/${eventId}/items/${itemId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setItems((prev) =>
        prev.map((item) =>
          item._id === itemId ? { ...item, status: newStatus } : item
        )
      );

      if (onChecklistUpdate) onChecklistUpdate();
    } catch (err) {
      console.error("Failed to update item status:", err);
    }
  };

  if (loading) return <p>Loading checklist...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Checklist</h2>
        {(role === "owner" || role === "admin") && (
          <div className="flex gap-2">
            <input
              type="text"
              className="border p-2 rounded"
              placeholder="Item name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              min={1}
              className="border p-2 rounded w-20"
              value={newItem.quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, quantity: Number(e.target.value) })
              }
            />
            <button
              onClick={handleAddItem}
              className="flex items-center bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
            >
              <FaPlus className="mr-1" /> Add
            </button>
          </div>
        )}
      </div>

      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-md"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-600">
                Quantity: {item.quantity || 1}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={item.status}
                onChange={(e) => handleStatusChange(item._id, e.target.value)}
                className="p-1 border rounded"
              >
                <option value="pending">Pending</option>
                <option value="packed">Packed</option>
                <option value="delivered">Delivered</option>
              </select>
              {(role === "owner" || role === "admin") && (
                <button
                  onClick={() => handleDeleteItem(item._id)}
                  className="text-red-600 hover:underline text-sm"
                >
                  Delete
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChecklistSection;
