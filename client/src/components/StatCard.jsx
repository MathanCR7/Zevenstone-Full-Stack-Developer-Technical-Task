// client/src/components/StatCard.jsx
import React from 'react';

const StatCard = ({ title, value, icon, colorClass }) => {
  // Logic: Automatically generate the text color for the watermark based on the background class.
  // Example: If colorClass is "bg-indigo-600", this creates "text-indigo-600"
  const derivedTextColor = colorClass && colorClass.includes('bg-') 
    ? colorClass.replace('bg-', 'text-') 
    : 'text-slate-400';

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 group hover:-translate-y-1">
      
      {/* Hover Gradient Overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 ${derivedTextColor}`}></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col justify-between h-full min-h-[80px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-auto">
            {value !== undefined && value !== null ? value : '-'}
          </h3>
        </div>

        {/* 
           Icon Container: 
           1. ${colorClass} sets the Solid Background (e.g., bg-indigo-600)
           2. text-white forces the icon to be white 
        */}
        <div className={`
            w-14 h-14 flex items-center justify-center rounded-2xl 
            ${colorClass} text-white 
            shadow-lg shadow-slate-200
            group-hover:scale-110 group-hover:rotate-3 
            transition-all duration-300 ease-out
        `}>
          {icon}
        </div>
      </div>

      {/* Decorative Background Icon (Watermark) */}
      <div className={`
          absolute -right-6 -bottom-8 
          opacity-[0.05] group-hover:opacity-[0.1] 
          text-9xl ${derivedTextColor} 
          pointer-events-none 
          group-hover:scale-110 group-hover:-rotate-12 
          transition-transform duration-700 ease-in-out
      `}>
        {icon}
      </div>
      
      {/* Bottom Border Accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colorClass}`}></div>
    </div>
  );
};

export default StatCard;