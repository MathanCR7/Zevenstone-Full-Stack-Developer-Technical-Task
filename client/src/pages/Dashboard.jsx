import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, fetchRecentActivity } from '../features/employeeSlice';
import { 
    FiUsers, FiUserCheck, FiUserX, FiBriefcase, 
    FiArrowRight, FiActivity, FiCalendar, FiPlus, FiLayers, FiTrendingUp 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';
import { format } from 'timeago.js'; // Optional: if you don't have this, use Date logic

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  // Safe Access to Redux State
  const { list = [], recentActivity = [], isLoading } = useSelector((state) => state.employees || {});

  useEffect(() => {
    // 1. Fetch Employees for Stats
    dispatch(fetchEmployees({ page: 1, search: '', limit: 1000 })); 
    
    // 2. Fetch LIVE Audit Logs for the Activity Widget (Admin Only usually, but let's show for demo)
    if(user?.role === 'admin') {
        dispatch(fetchRecentActivity());
    }
  }, [dispatch, user]);

  // Derived Statistics
  const totalEmployees = list.length;
  const activeCount = list.filter(e => e.status === 'active').length;
  const inactiveCount = list.filter(e => e.status === 'inactive').length;
  const uniqueDepts = [...new Set(list.map(item => item.department))].length;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* 1. Hero / Welcome Section */}
      <div className="relative bg-slate-900 rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl shadow-indigo-900/20 group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900 opacity-90 group-hover:scale-105 transition-transform duration-[2s]"></div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 blur-3xl rounded-full"></div>
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-400 opacity-20 blur-3xl rounded-full"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                    Hello, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-white">{user?.email?.split('@')[0]}</span>
                  </h1>
                  <p className="text-indigo-100 text-lg max-w-xl font-light leading-relaxed">
                      You have <span className="font-bold text-white border-b-2 border-indigo-400 pb-0.5">{totalEmployees} employees</span> currently under management. 
                      System performance is optimal.
                  </p>
              </div>
              <Link 
                to="/employees" 
                className="group flex items-center gap-3 bg-white/10 hover:bg-white text-white hover:text-indigo-900 px-7 py-4 rounded-2xl font-bold transition-all hover:shadow-xl hover:-translate-y-1 backdrop-blur-md border border-white/20"
              >
                 <div className="p-1 bg-white/20 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <FiPlus size={20} /> 
                 </div>
                 Add Employee
              </Link>
          </div>
      </div>

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard 
            title="Total Workforce" 
            value={totalEmployees} 
            icon={<FiUsers size={28} />} 
            colorClass="text-indigo-600 bg-indigo-600"
        />
        <StatCard 
            title="Active Employees" 
            value={activeCount} 
            icon={<FiUserCheck size={28} />} 
            colorClass="text-emerald-500 bg-emerald-500"
        />
        <StatCard 
            title="On Leave / Inactive" 
            value={inactiveCount} 
            icon={<FiUserX size={28} />} 
            colorClass="text-rose-500 bg-rose-500" 
        />
        <StatCard 
            title="Departments" 
            value={uniqueDepts} 
            icon={<FiBriefcase size={28} />} 
            colorClass="text-amber-500 bg-amber-500" 
        />
      </div>

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Recent Hires Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] flex flex-col overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-white">
                <div>
                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        Recent Hires
                        <span className="text-xs font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md">New</span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">Newest team members added to the portal.</p>
                </div>
                <Link to="/employees" className="text-indigo-600 hover:text-indigo-700 font-bold text-sm flex items-center gap-2 group bg-indigo-50 hover:bg-indigo-100 px-4 py-2 rounded-xl transition-all">
                    View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs text-slate-400 uppercase font-bold tracking-wider">
                        <tr>
                            <th className="px-8 py-4 font-semibold">Employee</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Dept</th>
                            <th className="px-8 py-4 text-right font-semibold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {list.length > 0 ? (
                            list.slice(0, 5).map((emp) => (
                                <tr key={emp._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative">
                                                <img 
                                                    src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random&color=fff`}
                                                    className="w-10 h-10 rounded-xl border-2 border-white shadow-sm group-hover:scale-110 transition-transform"
                                                    alt=""
                                                />
                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{emp.firstName} {emp.lastName}</p>
                                                <p className="text-xs text-slate-400">{emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600">{emp.role}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md uppercase tracking-wide">
                                            {emp.department}
                                        </span>
                                    </td>
                                    <td className="px-8 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                            emp.status === 'active' 
                                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                              : 'bg-rose-50 text-rose-600 border border-rose-100'
                                        }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                            {emp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-slate-400">
                                    {isLoading ? 'Loading data...' : 'No employees found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* LIVE System Activity Widget */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] p-8 flex flex-col h-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-slate-800">Live Activity</h3>
                    <p className="text-xs text-slate-400 font-medium">Real-time system updates</p>
                </div>
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 animate-pulse">
                    <FiActivity size={20} />
                </div>
            </div>
            
            <div className="relative space-y-8 pl-3 flex-1">
                {/* Vertical Line */}
                <div className="absolute top-3 bottom-3 left-[19px] w-[2px] bg-slate-100"></div>

                {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((log, i) => (
                        <div key={log._id || i} className="relative flex items-start gap-5 group">
                            <div className={`relative z-10 w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center shrink-0 text-white 
                                ${log.action === 'CREATE' ? 'bg-indigo-500' : log.action === 'DELETE' ? 'bg-rose-500' : 'bg-amber-500'} 
                                group-hover:scale-110 transition-transform`}>
                                {log.action === 'CREATE' ? <FiPlus size={12}/> : log.action === 'DELETE' ? <FiUserX size={12}/> : <FiActivity size={12}/>}
                            </div>
                            <div className="group-hover:translate-x-1 transition-transform duration-300">
                                <p className="text-sm font-bold text-slate-700">
                                    {log.action === 'CREATE' ? 'New Employee' : log.action}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed max-w-[200px] truncate" title={log.details}>
                                    {log.details}
                                </p>
                                <span className="text-[10px] font-bold text-slate-300 mt-1 block flex items-center gap-1">
                                    <FiCalendar size={10} /> {new Date(log.createdAt).toLocaleString([], { hour: '2-digit', minute:'2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-slate-400 text-sm py-4">No recent activity</div>
                )}
            </div>
            
            {/* Redirect Button */}
            {user?.role === 'admin' && (
                <button 
                    onClick={() => navigate('/audit-logs')}
                    className="w-full mt-8 py-3.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all shadow-sm"
                >
                    View Security Logs
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;