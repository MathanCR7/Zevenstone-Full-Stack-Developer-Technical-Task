import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees } from '../features/employeeSlice';
import { FiUsers, FiUserCheck, FiUserX, FiBriefcase, FiArrowUpRight, FiClock } from 'react-icons/fi';
import StatCard from '../components/StatCard';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  // Fetch employees to calculate stats, no search needed for dashboard
  const { list = [], totalEmployees = 0 } = useSelector((state) => state.employees || {});

  useEffect(() => {
    // Only fetch if we don't have data yet
    if (list.length === 0) {
        dispatch(fetchEmployees({ page: 1, search: '' }));
    }
  }, [dispatch, list.length]);

  // Derived Stats
  const activeCount = list.filter(e => e.status === 'active').length;
  const inactiveCount = list.filter(e => e.status === 'inactive').length;
  // Just for demo: unique departments
  const deptCount = [...new Set(list.map(item => item.department))].length;

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-200">
          <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0]}!</h1>
              <p className="text-indigo-100 opacity-90 max-w-xl">
                  Here's what's happening with your team today. You have {totalEmployees} total employees managed in the system.
              </p>
          </div>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute bottom-0 right-20 -mb-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={totalEmployees} icon={<FiUsers size={24} className="text-indigo-600" />} color="bg-indigo-600" />
        <StatCard title="Active Status" value={activeCount} icon={<FiUserCheck size={24} className="text-emerald-600" />} color="bg-emerald-600" />
        <StatCard title="On Leave / Inactive" value={inactiveCount} icon={<FiUserX size={24} className="text-rose-600" />} color="bg-rose-600" />
        <StatCard title="Departments" value={deptCount} icon={<FiBriefcase size={24} className="text-amber-600" />} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Hires Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-800">Recent Hires</h3>
                <a href="/employees" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                    View All <FiArrowUpRight />
                </a>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-slate-400 uppercase font-semibold">
                        <tr>
                            <th className="pb-3 pl-2">Employee</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3">Joined Date</th>
                            <th className="pb-3 text-right">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {list.slice(0, 5).map((emp) => (
                            <tr key={emp._id} className="group">
                                <td className="py-3 pl-2">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                            {emp.firstName[0]}{emp.lastName[0]}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-700 text-sm">{emp.firstName} {emp.lastName}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 text-sm text-slate-600">{emp.role}</td>
                                <td className="py-3 text-sm text-slate-500">
                                    {new Date(emp.createdAt).toLocaleDateString()}
                                </td>
                                <td className="py-3 text-right">
                                    <span className={`inline-block w-2 h-2 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                </td>
                            </tr>
                        ))}
                        {list.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-slate-400 py-4 text-sm">No recent data available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Activity Feed (Mockup) */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {[1, 2, 3].map((_, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400">
                                <FiClock size={14} />
                            </div>
                            {i !== 2 && <div className="w-0.5 h-full bg-slate-100 my-1"></div>}
                        </div>
                        <div>
                            <p className="text-sm text-slate-800 font-medium">System Audit Log</p>
                            <p className="text-xs text-slate-500 mt-0.5">Automated backup completed successfully.</p>
                            <span className="text-[10px] text-slate-400 font-semibold mt-1 block">2 hours ago</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;