import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-800">{value}</h3>
        </div>
        <div className={`p-4 rounded-xl ${color} bg-opacity-10 text-opacity-100`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;