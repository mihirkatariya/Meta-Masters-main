import React from 'react';

const StatCard = ({ title, value, icon, color, bgColor }) => {
  return (
    <div className="card flex items-center">
      <div className={`p-3 rounded-lg mr-4 ${bgColor}`}>
        {React.cloneElement(icon, { className: color, size: 24 })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;