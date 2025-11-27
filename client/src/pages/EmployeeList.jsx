import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../features/employeeSlice';
import { 
  FiSearch, FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, 
  FiFilter, FiDownload, FiUser, FiRefreshCw 
} from 'react-icons/fi';
import EmployeeForm from '../components/EmployeeForm';
import debounce from 'lodash.debounce';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { list = [], totalPages = 1, currentPage = 1, isLoading } = useSelector((state) => state.employees || {});
  
  const [search, setSearch] = useState('');
  
  // NEW: Filter States
  const [department, setDepartment] = useState('All Departments');
  const [status, setStatus] = useState('All Status');
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const debouncedSearch = debounce((val) => {
    setSearch(val);
    // Reset to page 1 on search
    dispatch(fetchEmployees({ page: 1, search: val, department, status }));
  }, 500);

  // Trigger fetch when Page, Search, or FILTERS change
  useEffect(() => {
    dispatch(fetchEmployees({ page: currentPage, search, department, status }));
  }, [dispatch, currentPage, department, status]); // Added department and status dependencies

  const handleCreate = async (data) => {
    await dispatch(addEmployee(data));
    setModalOpen(false);
  };

  const handleUpdate = async (data) => {
    await dispatch(updateEmployee({ id: editingEmployee._id, data }));
    setModalOpen(false);
    setEditingEmployee(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this employee? This action cannot be undone.')) {
      dispatch(deleteEmployee(id));
    }
  };

  const openEditModal = (emp) => {
    setEditingEmployee(emp);
    setModalOpen(true);
  };

  const refreshData = () => {
      dispatch(fetchEmployees({ page: currentPage, search, department, status }));
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">All Employees</h2>
           <p className="text-slate-500 text-sm mt-1">Manage your team members, roles, and permissions.</p>
        </div>
        <div className="flex flex-wrap gap-3">
             <button 
                onClick={refreshData}
                className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-indigo-600 transition shadow-sm"
                title="Refresh List"
             >
                <FiRefreshCw className={isLoading ? "animate-spin" : ""} size={18} />
             </button>
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition shadow-sm hover:shadow-md">
                <FiDownload size={16} /> Export CSV
            </button>
            <button 
                onClick={() => { setEditingEmployee(null); setModalOpen(true); }} 
                className="btn-primary px-5 py-2.5 text-sm shadow-indigo-200"
            >
                <FiPlus size={18} className="mr-2" /> Add Employee
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg" />
           <input 
             onChange={(e) => debouncedSearch(e.target.value)} 
             placeholder="Search by name, email, or ID..." 
             className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all text-sm font-medium placeholder:text-slate-400" 
           />
        </div>
        <div className="flex flex-wrap items-center gap-3">
             <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                <FiFilter className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Filters:</span>
             </div>
             
             {/* Department Filter */}
             <select 
                value={department}
                onChange={(e) => {
                    setDepartment(e.target.value);
                    // Reset to page 1 is handled by useEffect deps or logic inside slice if preferred, 
                    // but usually setting state triggers useEffect which handles it. 
                    // To be safe/clean UX, we often reset page in a real handler or let Redux handle.
                }}
                className="form-select w-full sm:w-40 py-3 bg-slate-50 border-transparent focus:bg-white cursor-pointer font-medium text-slate-600"
             >
                 <option>All Departments</option>
                 <option>IT</option>
                 <option>HR</option>
                 <option>Sales</option>
                 <option>Marketing</option>
                 <option>Finance</option>
             </select>

             {/* Status Filter */}
             <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select w-full sm:w-36 py-3 bg-slate-50 border-transparent focus:bg-white cursor-pointer font-medium text-slate-600"
             >
                 <option>All Status</option>
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
             </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[600px] relative">
        {isLoading ? (
           <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <p className="text-slate-500 font-medium">Updating employee records...</p>
           </div>
        ) : null}

        {list.length === 0 && !isLoading ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
               <div className="bg-slate-50 p-6 rounded-full mb-6 ring-8 ring-slate-50">
                    <FiUser size={48} className="text-slate-300" />
               </div>
               <p className="text-xl font-bold text-slate-700">No employees found.</p>
               <p className="text-sm text-slate-500 mt-2 max-w-xs text-center">
                   Try adjusting your search or filters to find what you are looking for.
               </p>
               <button 
                  onClick={() => { setEditingEmployee(null); setModalOpen(true); }}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
               >
                   + Add New Employee
               </button>
           </div>
        ) : (
        <>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-5 pl-8">Employee Details</th>
                <th className="p-5">Contact Info</th>
                <th className="p-5">Role & Department</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {list.map((emp) => (
                <tr key={emp._id} className="group hover:bg-slate-50/60 transition-colors duration-200">
                  
                  {/* Name & Avatar */}
                  <td className="p-5 pl-8 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="relative shrink-0">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random&color=fff&bold=true`} 
                          alt="Avatar" 
                          className="w-11 h-11 rounded-xl object-cover shadow-sm ring-2 ring-white group-hover:ring-indigo-100 transition-all"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">
                            {emp.firstName} {emp.lastName}
                        </p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5 bg-slate-100 px-1.5 py-0.5 rounded w-fit">
                            {emp.employeeId}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-5 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-600">{emp.email}</p>
                  </td>

                  {/* Role & Dept */}
                  <td className="p-5 whitespace-nowrap">
                    <p className="text-sm font-bold text-slate-700">{emp.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
                        <p className="text-xs text-slate-500 font-medium">{emp.department}</p>
                    </div>
                  </td>

                  {/* Status */}
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

                  {/* Actions - ALWAYS VISIBLE */}
                  <td className="p-5 text-right pr-8 whitespace-nowrap">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => openEditModal(emp)} 
                        className="p-2 text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md" 
                        title="Edit Employee"
                      >
                        <FiEdit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(emp._id)} 
                        className="p-2 text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-600 hover:text-white rounded-lg transition-all shadow-sm hover:shadow-md" 
                        title="Delete Employee"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4">
           <span className="text-sm font-medium text-slate-500">
             Showing page <span className="font-bold text-slate-800">{currentPage}</span> of <span className="font-bold text-slate-800">{totalPages}</span>
           </span>
           <div className="flex gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => dispatch(fetchEmployees({ page: currentPage - 1, search, department, status }))} 
                className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-600 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition flex items-center gap-2 shadow-sm"
              >
                <FiChevronLeft /> Previous
              </button>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => dispatch(fetchEmployees({ page: currentPage + 1, search, department, status }))} 
                className="px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-600 text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition flex items-center gap-2 shadow-sm"
              >
                Next <FiChevronRight />
              </button>
           </div>
        </div>
        </>
        )}
      </div>

      {isModalOpen && (
        <EmployeeForm 
          onClose={() => { setModalOpen(false); setEditingEmployee(null); }}
          onSubmit={editingEmployee ? handleUpdate : handleCreate}
          initialData={editingEmployee || {}}
        />
      )}
    </div>
  );
};

export default EmployeeList;