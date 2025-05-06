import React, { useState } from 'react';
import { 
  FaSave, 
  FaMoon, 
  FaSun, 
  FaCalendarAlt, 
  FaClock, 
  FaEye, 
  FaEyeSlash, 
  FaToggleOn, 
  FaToggleOff, 
  FaGlobe 
} from 'react-icons/fa';

import Sidebar from '../components/Sidebar.jsx';
import Header from "../components/Header.jsx";

const SettingsPage = () => {
  const [eventSettings, setEventSettings] = useState({
    name: 'Summer Camping Trip',
    type: 'Trip',
    startDate: '2023-07-15',
    endDate: '2023-07-22',
    location: 'Yellowstone National Park',
    timezone: 'America/Denver',
  });

  const handleEventSettingChange = (e) => {
    setEventSettings({
      ...eventSettings,
      [e.target.name]: e.target.value,
    });
  };

  return <div>Settings Page</div>;
};

export default SettingsPage;