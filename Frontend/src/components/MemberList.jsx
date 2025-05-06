import React, { useState } from "react";
import { FaUserPlus, FaEllipsisV, FaCheck } from "react-icons/fa";
import axios from "axios";

const initialMembers = [
  {
    id: 1,
    name: "Sarah Wilson",
    email: "sarah@example.com",
    role: "Admin",
    itemsPacked: 5,
    status: "active",
  },
  {
    id: 2,
    name: "Michael Brown",
    email: "michael@example.com",
    role: "Member",
    itemsPacked: 3,
    status: "active",
  },
  {
    id: 3,
    name: "Emma Davis",
    email: "emma@example.com",
    role: "Viewer",
    itemsPacked: 0,
    status: "pending",
  },
];

const MemberList = ({ eventId }) => {
  const [members, setMembers] = useState(initialMembers);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");
  const [inviteLink, setInviteLink] = useState("");

  const generateInviteLink = () => {
    const link = `https://packpal.com/invite/${Math.random()
      .toString(36)
      .substring(2, 10)}`;
    setInviteLink(link);
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!email) {
      alert("Please enter an email.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/events/${eventId}/invite`,
        { email, role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const { event } = response.data;

      // Update the members list with the new member
      const newMember = event.members.find((m) => m.user.email === email);
      console.log(newMember);
      if (newMember) {
        setMembers([
          ...members,
          { id: newMember.user._id, name: newMember.user.name, email, role },
        ]);
      }

      alert(`Member invited successfully: ${email}`);
      setEmail("");
      setRole("Member"); // Reset role to default
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to invite member.");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Members</h2>
        <form
          onSubmit={handleAddMember}
          className="flex items-center space-x-4"
        >
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="admin">Admin</option>
            <option value="member">Member</option>
            <option value="viewer">Viewer</option>
          </select>
          <button type="submit" className="btn-primary flex items-center">
            <FaUserPlus className="mr-2" />
            Add Member
          </button>
        </form>
      </div>

      <ul>
        {members.map((member) => (
          <li
            key={member.id}
            className="flex justify-between items-center py-2 border-b"
          >
            <div>
              <p className="font-semibold">{member.name}</p>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>
            <p className="text-sm text-gray-800">{member.role}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemberList;
