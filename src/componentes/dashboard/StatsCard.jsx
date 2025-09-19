// components/StatsCard.js
import React from "react";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-20`}>{icon}</div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
