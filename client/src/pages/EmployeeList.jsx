// client/src/pages/EmployeeList.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../features/employeeSlice';
import { 
  FiSearch, FiPlus, FiChevronLeft, FiChevronRight, 
  FiFilter, FiDownload, FiUser, FiRefreshCw
} from 'react-icons/fi';
import EmployeeForm from '../components/EmployeeForm';
import TableRow from '../components/TableRow'; // Importing the new component
import debounce from 'lodash.debounce';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { list = [], totalPages = 1, currentPage = 1, isLoading } = useSelector((state) => state.employees || {});
  
  const [search, setSearch] = useState('');
  
  // Filter States
  const [department, setDepartment] = useState('All Departments');
  const [status, setStatus] = useState('All Status');
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isExporting, setIsExporting] = useState(false);

  const debouncedSearch = debounce((val) => {
    setSearch(val);
    dispatch(fetchEmployees({ page: 1, search: val, department, status }));
  }, 500);

  useEffect(() => {
    dispatch(fetchEmployees({ page: currentPage, search, department, status }));
  }, [dispatch, currentPage, department, status]);

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

  const handleExport = () => {
    if (list.length === 0) {
      alert("No data available to export.");
      return;
    }
    setIsExporting(true);
    const headers = ["Employee ID", "First Name", "Last Name", "Email", "Role", "Department", "Status", "Date Joined"];
    const csvRows = list.map(emp => {
      const date = new Date(emp.dateOfJoining).toLocaleDateString();
      return [
        `"${emp.employeeId}"`, `"${emp.firstName}"`, `"${emp.lastName}"`, `"${emp.email}"`,
        `"${emp.role}"`, `"${emp.department}"`, `"${emp.status}"`, `"${date}"`
      ].join(",");
    });
    const csvContent = [headers.join(","), ...csvRows].join("\n");
    setTimeout(() => {
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `employees_export_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsExporting(false);
    }, 800);
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
             
             <button 
                onClick={handleExport}
                disabled={isExporting}
                className={`flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm hover:shadow-md hover:border-indigo-200 ${isExporting ? 'cursor-not-allowed opacity-75' : 'hover:bg-slate-50'}`}
             >
                {isExporting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-indigo-600 rounded-full animate-spin"></div>
                        <span>Exporting...</span>
                    </>
                ) : (
                    <>
                        <FiDownload size={16} className="text-indigo-600" /> 
                        <span>Export CSV</span>
                    </>
                )}
            </button>

            <button 
                onClick={() => { setEditingEmployee(null); setModalOpen(true); }} 
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 transition-all transform hover:scale-[1.02]"
            >
                <FiPlus size={18} /> Add Employee
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
             
             <select 
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="form-select w-full sm:w-40 py-3 bg-slate-50 border-transparent focus:bg-white cursor-pointer font-medium text-slate-600 rounded-xl outline-none"
             >
                 <option>All Departments</option>
                 <option>IT</option>
                 <option>HR</option>
                 <option>Sales</option>
                 <option>Marketing</option>
                 <option>Finance</option>
             </select>

             <select 
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="form-select w-full sm:w-36 py-3 bg-slate-50 border-transparent focus:bg-white cursor-pointer font-medium text-slate-600 rounded-xl outline-none"
             >
                 <option>All Status</option>
                 <option value="active">Active</option>
                 <option value="inactive">Inactive</option>
             </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-transparent md:bg-white rounded-3xl md:shadow-sm md:border border-slate-200 overflow-hidden flex flex-col min-h-[600px] relative">
        {isLoading ? (
           <div className="absolute inset-0 z-10 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
               <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <p className="text-slate-500 font-medium">Updating employee records...</p>
           </div>
        ) : null}

        {list.length === 0 && !isLoading ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 bg-white rounded-3xl border border-slate-200">
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
        <div className="md:overflow-x-auto flex-1">
          {/* Note: The 'md:table' class ensures the table structure is only used on desktop */}
          <table className="w-full text-left border-collapse block md:table">
            <thead className="hidden md:table-header-group bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
              <tr>
                <th className="p-5 pl-8">Employee Details</th>
                <th className="p-5">Contact Info</th>
                <th className="p-5">Role & Department</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right pr-8">Actions</th>
              </tr>
            </thead>
            <tbody className="block md:table-row-group divide-y divide-slate-100">
              {list.map((emp) => (
                <TableRow 
                  key={emp._id} 
                  emp={emp} 
                  onEdit={openEditModal} 
                  onDelete={handleDelete} 
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 md:border-t border-slate-100 md:bg-slate-50/30 flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 md:mt-0 bg-white rounded-2xl md:rounded-none border md:border-0 shadow-sm md:shadow-none">
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