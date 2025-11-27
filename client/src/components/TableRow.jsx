// client/src/components/TableRow.jsx
import React from 'react';
import { FiEdit2, FiTrash2, FiMail, FiBriefcase, FiGrid } from 'react-icons/fi';

const TableRow = ({ emp, onEdit, onDelete }) => {
  return (
    <>
      {/* --- DESKTOP VIEW (Table Row) --- */}
      <tr className="hidden md:table-row hover:bg-slate-50/60 transition-colors duration-200 border-b border-slate-100 last:border-0">
        <td className="p-5 pl-8 whitespace-nowrap">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img 
                src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random&color=fff&bold=true`} 
                alt="Avatar" 
                className="w-11 h-11 rounded-xl object-cover shadow-sm ring-2 ring-white"
              />
              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">
                {emp.firstName} {emp.lastName}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                {emp.employeeId}
              </p>
            </div>
          </div>
        </td>

        <td className="p-5 whitespace-nowrap">
          <p className="text-sm font-medium text-slate-600">{emp.email}</p>
        </td>

        <td className="p-5 whitespace-nowrap">
          <p className="text-sm font-bold text-slate-700">{emp.role}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            <p className="text-xs text-slate-500 font-medium">{emp.department}</p>
          </div>
        </td>

        <td className="p-5 whitespace-nowrap">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
            emp.status === 'active' 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
            {emp.status}
          </span>
        </td>

        <td className="p-5 text-right pr-8 whitespace-nowrap">
          <div className="flex items-center justify-end gap-3">
            <button 
              onClick={() => onEdit(emp)} 
              className="p-2 text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-all shadow-sm"
              title="Edit"
            >
              <FiEdit2 size={16} />
            </button>
            <button 
              onClick={() => onDelete(emp._id)} 
              className="p-2 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-lg transition-all shadow-sm"
              title="Delete"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </td>
      </tr>

      {/* --- MOBILE VIEW (Card Layout) --- */}
      <tr className="md:hidden block bg-white border border-slate-200 rounded-2xl mb-4 shadow-sm p-5 relative overflow-hidden">
        <td className="block mb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img 
                src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random&color=fff&bold=true`} 
                alt="Avatar" 
                className="w-12 h-12 rounded-xl object-cover shadow-sm"
              />
              <div>
                <h4 className="font-bold text-slate-800 text-base">{emp.firstName} {emp.lastName}</h4>
                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  {emp.employeeId}
                </span>
              </div>
            </div>
            
            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
               emp.status === 'active' 
                 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                 : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              {emp.status}
            </span>
          </div>
        </td>

        {/* Data Grid for Mobile */}
        <td className="block border-t border-slate-100 pt-4 pb-2">
            <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <FiMail size={14} />
                    </div>
                    <span className="text-slate-600 font-medium break-all">{emp.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <FiBriefcase size={14} />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-slate-800 font-bold">{emp.role}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                        <FiGrid size={14} />
                    </div>
                    <span className="text-slate-600 font-medium">{emp.department} Department</span>
                </div>
            </div>
        </td>

        {/* Mobile Actions Footer */}
        <td className="block mt-4 pt-4 border-t border-slate-100">
          <div className="flex gap-3">
            <button 
              onClick={() => onEdit(emp)} 
              className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 font-bold text-sm rounded-xl border border-indigo-100 active:scale-95 transition-transform"
            >
              <FiEdit2 /> Edit
            </button>
            <button 
              onClick={() => onDelete(emp._id)} 
              className="flex-1 py-2.5 flex items-center justify-center gap-2 bg-rose-50 text-rose-600 font-bold text-sm rounded-xl border border-rose-100 active:scale-95 transition-transform"
            >
              <FiTrash2 /> Delete
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default TableRow;