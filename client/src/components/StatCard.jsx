import React from 'react';

const StatCard = ({ title, value, icon, colorClass }) => {
  return (
    <div className="relative overflow-hidden bg-white rounded-3xl p-6 border border-slate-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all duration-500 group hover:-translate-y-1">
      
      {/* Hover Gradient Overlay */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 ${colorClass.split(' ')[1]}`}></div>

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col justify-between h-full min-h-[80px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{title}</p>
          <h3 className="text-4xl font-extrabold text-slate-800 tracking-tight mt-auto">
            {value !== undefined && value !== null ? value : '-'}
          </h3>
        </div>

        {/* Icon Container with Glass Effect and Ring */}
        <div className={`
            p-4 rounded-2xl 
            ${colorClass} bg-opacity-10 text-opacity-100 
            shadow-sm 
            group-hover:scale-110 group-hover:rotate-3 
            group-hover:ring-4 ring-opacity-20 ring-current
            transition-all duration-300 ease-out
        `}>
          {icon}
        </div>
      </div>

      {/* Decorative Background Icon (Watermark) */}
      <div className={`
          absolute -right-6 -bottom-8 
          opacity-[0.05] group-hover:opacity-[0.1] 
          text-9xl ${colorClass.split(' ')[0]} 
          pointer-events-none 
          group-hover:scale-110 group-hover:-rotate-12 
          transition-transform duration-700 ease-in-out
      `}>
        {icon}
      </div>
      
      {/* Bottom Border Accent */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${colorClass.split(' ')[1]}`}></div>
    </div>
  );
};

export default StatCard;