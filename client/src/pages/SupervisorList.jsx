// client/src/pages/SupervisorList.jsx
import React, { useState, useEffect } from 'react';
import { FiTrash2, FiUser, FiSearch, FiShield, FiPlus, FiLoader } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SupervisorList = () => {
  const navigate = useNavigate();
  const [supervisors, setSupervisors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSupervisors = async () => {
        try {
            const response = await api.get('/auth/supervisors');
            setSupervisors(response.data.data);
        } catch (error) {
            console.error("Failed to fetch supervisors", error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchSupervisors();
  }, []);

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this supervisor? Access will be revoked immediately.')) {
        try {
            await api.delete(`/auth/users/${id}`);
            setSupervisors(supervisors.filter(s => s._id !== id));
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete user');
        }
    }
  };

  const filteredList = supervisors.filter(sup => 
      sup.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade-in space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                    <FiShield className="text-indigo-600"/> Manage Supervisors
                </h2>
                <p className="text-slate-500 text-sm">View and manage administrative access.</p>
            </div>
            <button 
                onClick={() => navigate('/supervisors/add')}
                className="btn-primary px-5 py-2.5 text-sm"
            >
                <FiPlus size={18} className="mr-2" /> Add Supervisor
            </button>
        </div>

        <div className="bg-transparent md:bg-white md:rounded-2xl md:border border-slate-200 md:shadow-sm overflow-hidden min-h-[400px] flex flex-col">
             {/* Toolbar */}
             <div className="p-4 border-b border-slate-100 bg-white rounded-2xl md:rounded-none border md:border-0 shadow-sm md:shadow-none mb-4 md:mb-0 md:bg-slate-50/50 flex gap-4">
                 <div className="relative flex-1 max-w-sm">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/>
                    <input 
                        placeholder="Search email..." 
                        className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>
             </div>

             <div className="md:overflow-x-auto flex-1">
                 {isLoading ? (
                     <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                         <FiLoader className="animate-spin text-3xl mb-2 text-indigo-600" />
                         <p>Loading supervisors...</p>
                     </div>
                 ) : (
                     <table className="w-full text-left block md:table">
                         <thead className="hidden md:table-header-group bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase">
                             <tr>
                                 <th className="p-4 pl-6">Supervisor Account</th>
                                 <th className="p-4">Role</th>
                                 <th className="p-4">Joined Date</th>
                                 <th className="p-4 text-right pr-6">Actions</th>
                             </tr>
                         </thead>
                         <tbody className="block md:table-row-group divide-y divide-slate-50">
                             {filteredList.map((sup) => (
                                 <tr key={sup._id} className="block md:table-row bg-white rounded-2xl mb-4 p-4 shadow-sm md:shadow-none md:bg-transparent md:mb-0 md:p-0 hover:bg-slate-50/80 transition-colors group border border-slate-100 md:border-0">
                                     <td className="block md:table-cell p-0 md:p-4 md:pl-6 mb-4 md:mb-0">
                                         <div className="flex items-center gap-3">
                                             <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shadow-sm">
                                                 <FiUser size={16}/>
                                             </div>
                                             <div>
                                                <span className="font-bold text-slate-700 text-sm block">{sup.email}</span>
                                                <span className="text-[10px] text-slate-400 font-mono">ID: {sup._id.substring(sup._id.length - 6)}</span>
                                             </div>
                                         </div>
                                     </td>
                                     <td className="block md:table-cell p-0 md:p-4 mb-2 md:mb-0 pl-12 md:pl-4">
                                         <span className="md:hidden text-xs text-slate-400 font-bold uppercase mr-2">Role:</span>
                                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-wide">
                                             {sup.role}
                                         </span>
                                     </td>
                                     <td className="block md:table-cell p-0 md:p-4 text-sm text-slate-500 font-medium pl-12 md:pl-4 mb-4 md:mb-0">
                                         <span className="md:hidden text-xs text-slate-400 font-bold uppercase mr-2">Joined:</span>
                                         {new Date(sup.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                     </td>
                                     <td className="block md:table-cell p-0 md:p-4 text-right md:pr-6 border-t md:border-0 border-slate-100 pt-3 md:pt-0 mt-2 md:mt-0">
                                         <button 
                                            onClick={() => handleDelete(sup._id)}
                                            className="w-full md:w-auto p-2 text-rose-600 bg-rose-50 md:text-slate-400 md:bg-transparent hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center justify-center md:inline-block gap-2"
                                            title="Revoke Access"
                                         >
                                             <FiTrash2 size={18} />
                                             <span className="md:hidden font-bold text-sm">Revoke Access</span>
                                         </button>
                                     </td>
                                 </tr>
                             ))}
                             {filteredList.length === 0 && (
                                 <tr>
                                     <td colSpan="4" className="p-12 text-center text-slate-400 text-sm">
                                         No supervisors found matching your criteria.
                                     </td>
                                 </tr>
                             )}
                         </tbody>
                     </table>
                 )}
             </div>
        </div>
    </div>
  );
};

export default SupervisorList;