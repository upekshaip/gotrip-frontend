import React from 'react';

const StatsCard = ({ title, value, iconColor }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
      </div>
      <div className={`w-12 h-12 rounded-full ${iconColor} opacity-20`}></div>
    </div>
  );
};

export default StatsCard;