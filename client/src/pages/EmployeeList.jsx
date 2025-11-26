import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, addEmployee, updateEmployee, deleteEmployee } from '../features/employeeSlice';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiChevronLeft, FiChevronRight, FiFilter, FiDownload } from 'react-icons/fi';
import EmployeeForm from '../components/EmployeeForm';
import debounce from 'lodash.debounce';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const { list = [], totalPages = 1, currentPage = 1, isLoading } = useSelector((state) => state.employees || {});
  
  const [search, setSearch] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const debouncedSearch = debounce((val) => {
    setSearch(val);
    dispatch(fetchEmployees({ page: 1, search: val }));
  }, 500);

  useEffect(() => {
    dispatch(fetchEmployees({ page: currentPage, search }));
  }, [dispatch, currentPage, search]);

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h2 className="text-2xl font-bold text-slate-800">All Employees</h2>
           <p className="text-slate-500 text-sm">Manage your team members and their account permissions.</p>
        </div>
        <div className="flex gap-3">
             <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold text-sm hover:bg-slate-50 transition shadow-sm">
                <FiDownload /> Export
            </button>
            <button 
                onClick={() => { setEditingEmployee(null); setModalOpen(true); }} 
                className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm"
            >
                <FiPlus size={18} /> Add Employee
            </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
           <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             onChange={(e) => debouncedSearch(e.target.value)} 
             placeholder="Search by name, email, or ID..." 
             className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl outline-none transition-all text-sm font-medium placeholder:text-slate-400" 
           />
        </div>
        <div className="flex items-center gap-2">
             <span className="text-sm font-semibold text-slate-500 hidden md:block">Filters:</span>
             <select className="form-select w-40 py-2.5">
                 <option>All Departments</option>
                 <option>IT</option>
                 <option>HR</option>
                 <option>Sales</option>
             </select>
             <select className="form-select w-32 py-2.5">
                 <option>All Status</option>
                 <option>Active</option>
                 <option>Inactive</option>
             </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col min-h-[500px]">
        {isLoading ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
               <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
               <p>Loading employee data...</p>
           </div>
        ) : list.length === 0 ? (
           <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
               <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <FiFilter size={32} className="text-slate-300" />
               </div>
               <p className="text-lg font-medium text-slate-500">No employees found.</p>
               <p className="text-sm">Try adjusting your search criteria.</p>
           </div>
        ) : (
        <>
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs font-bold tracking-wider">
              <tr>
                <th className="p-5 pl-6">Employee</th>
                <th className="p-5">Contact</th>
                <th className="p-5">Role & Dept</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {list.map((emp) => (
                <tr key={emp._id} className="group hover:bg-slate-50/50 transition duration-200">
                  <td className="p-5 pl-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random&color=fff`} 
                          alt="Avatar" 
                          className="w-10 h-10 rounded-full object-cover shadow-sm ring-2 ring-white"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{emp.firstName} {emp.lastName}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{emp.employeeId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-sm text-slate-600">{emp.email}</p>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-semibold text-slate-700">{emp.role}</p>
                    <p className="text-xs text-indigo-500 font-medium bg-indigo-50 px-2 py-0.5 rounded-md inline-block mt-1">{emp.department}</p>
                  </td>
                  <td className="p-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      emp.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                      {emp.status}
                    </span>
                  </td>
                  <td className="p-5 text-right pr-6">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEditModal(emp)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit">
                        <FiEdit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(emp._id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition" title="Delete">
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
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
           <span className="text-sm font-medium text-slate-500">
             Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
           </span>
           <div className="flex gap-2">
              <button 
                disabled={currentPage === 1} 
                onClick={() => dispatch(fetchEmployees({ page: currentPage - 1, search }))} 
                className="p-2 px-3 border border-slate-200 rounded-lg bg-white text-slate-600 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 hover:text-indigo-600 transition flex items-center gap-1"
              >
                <FiChevronLeft /> Prev
              </button>
              <button 
                disabled={currentPage === totalPages} 
                onClick={() => dispatch(fetchEmployees({ page: currentPage + 1, search }))} 
                className="p-2 px-3 border border-slate-200 rounded-lg bg-white text-slate-600 text-sm font-medium disabled:opacity-50 hover:bg-slate-50 hover:text-indigo-600 transition flex items-center gap-1"
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