// client/src/pages/Dashboard.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployees, fetchRecentActivity } from '../features/employeeSlice';
import { 
    FiUsers, FiUserCheck, FiUserX, FiBriefcase, 
    FiArrowRight, FiActivity, FiCalendar, FiPlus, 
    FiLayers, FiTrendingUp, FiTrash2, FiEdit3, FiShield 
} from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../components/StatCard';

const formatTimeAgo = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return interval + "y ago";
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return interval + "mo ago";
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return interval + "d ago";
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return interval + "h ago";
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return interval + "m ago";
    
    return "Just now";
};

const getActionStyle = (action) => {
    switch (action) {
        case 'CREATE':
            return { 
                icon: <FiPlus size={14} />, 
                bg: 'bg-emerald-500', 
                shadow: 'shadow-emerald-200',
                label: 'New Record'
            };
        case 'DELETE':
            return { 
                icon: <FiTrash2 size={14} />, 
                bg: 'bg-rose-500', 
                shadow: 'shadow-rose-200',
                label: 'Deleted'
            };
        case 'UPDATE':
            return { 
                icon: <FiEdit3 size={14} />, 
                bg: 'bg-amber-500', 
                shadow: 'shadow-amber-200',
                label: 'Updated'
            };
        default:
            return { 
                icon: <FiActivity size={14} />, 
                bg: 'bg-indigo-500', 
                shadow: 'shadow-indigo-200',
                label: 'System Log'
            };
    }
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const { list = [], recentActivity = [], isLoading } = useSelector((state) => state.employees || {});

  useEffect(() => {
    dispatch(fetchEmployees({ page: 1, search: '', limit: 1000 })); 
    if(user?.role === 'admin') {
        dispatch(fetchRecentActivity());
    }
  }, [dispatch, user]);

  const totalEmployees = list.length;
  const activeCount = list.filter(e => e.status === 'active').length;
  const inactiveCount = list.filter(e => e.status === 'inactive').length;
  const uniqueDepts = [...new Set(list.map(item => item.department))].length;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* 1. Hero / Welcome Section */}
      <div className="relative bg-slate-900 rounded-3xl p-6 md:p-10 overflow-hidden shadow-2xl shadow-indigo-900/20 group transition-all duration-500 hover:shadow-indigo-900/30">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-700 to-slate-900 opacity-95 group-hover:scale-105 transition-transform duration-[3s]"></div>
          <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
              backgroundSize: '24px 24px'
          }}></div>
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                  <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 rounded-md bg-white/10 border border-white/10 text-[10px] font-bold text-indigo-100 uppercase tracking-wider backdrop-blur-md">
                          Overview
                      </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight mb-2">
                    Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-100 to-white">{user?.email?.split('@')[0]}</span>
                  </h1>
                  <p className="text-indigo-100/80 text-base font-medium max-w-xl leading-relaxed">
                      System performance is optimal. You are managing <span className="text-white font-bold border-b border-indigo-400/50">{totalEmployees} employees</span> across {uniqueDepts} departments.
                  </p>
              </div>
              <Link 
                to="/employees" 
                className="group flex items-center gap-3 bg-white hover:bg-indigo-50 text-indigo-900 px-6 py-3.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:-translate-y-0.5 border border-white/50"
              >
                 <div className="flex items-center justify-center w-6 h-6 bg-indigo-600 text-white rounded-full group-hover:scale-110 transition-transform">
                    <FiPlus size={14} /> 
                 </div>
                 <span>Add Employee</span>
              </Link>
          </div>
      </div>

      {/* 2. Statistics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard 
            title="Total Workforce" 
            value={totalEmployees} 
            icon={<FiUsers size={24} />} 
            colorClass="text-indigo-600 bg-indigo-600"
        />
        <StatCard 
            title="Active Employees" 
            value={activeCount} 
            icon={<FiUserCheck size={24} />} 
            colorClass="text-emerald-500 bg-emerald-500"
        />
        <StatCard 
            title="Inactive / Leave" 
            value={inactiveCount} 
            icon={<FiUserX size={24} />} 
            colorClass="text-rose-500 bg-rose-500" 
        />
        <StatCard 
            title="Departments" 
            value={uniqueDepts} 
            icon={<FiBriefcase size={24} />} 
            colorClass="text-amber-500 bg-amber-500" 
        />
      </div>

      {/* 3. Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Recent Hires Table */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-slate-200/60 shadow-sm flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <FiTrendingUp size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Recent Hires</h3>
                        <p className="text-xs text-slate-400 font-medium">Latest team additions</p>
                    </div>
                </div>
                <Link to="/employees" className="text-indigo-600 hover:text-indigo-700 font-bold text-xs flex items-center gap-1 group bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors">
                    View All <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
            
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-left">
                    <thead className="hidden md:table-header-group bg-slate-50/50 text-[11px] text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-3 font-bold">Employee</th>
                            <th className="px-6 py-3 font-bold">Role</th>
                            <th className="px-6 py-3 font-bold">Department</th>
                            <th className="px-6 py-3 text-right font-bold">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {list.length > 0 ? (
                            list.slice(0, 5).map((emp) => (
                                <tr key={emp._id} className="block md:table-row hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-4 block md:table-cell">
                                        <div className="flex items-center justify-between md:justify-start gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="relative">
                                                    <img 
                                                        src={`https://ui-avatars.com/api/?name=${emp.firstName}+${emp.lastName}&background=random&color=fff&bold=true`}
                                                        className="w-9 h-9 rounded-xl border border-slate-100 shadow-sm group-hover:scale-105 transition-transform"
                                                        alt=""
                                                    />
                                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white rounded-full ${emp.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-700 text-sm">{emp.firstName} {emp.lastName}</p>
                                                    <p className="text-[11px] text-slate-400">{emp.email}</p>
                                                </div>
                                            </div>
                                            {/* Mobile Status - Visible only on mobile here to save space */}
                                            <div className="md:hidden">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                                    emp.status === 'active' 
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                                    : 'bg-rose-50 text-rose-600 border border-rose-100'
                                                }`}>
                                                    {emp.status}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 md:py-4 text-sm font-medium text-slate-600 block md:table-cell pl-16 md:pl-6">
                                        <span className="md:hidden text-xs text-slate-400 uppercase mr-2 font-bold">Role:</span>
                                        {emp.role}
                                    </td>
                                    <td className="px-6 py-2 md:py-4 block md:table-cell pl-16 md:pl-6">
                                        <span className="md:hidden text-xs text-slate-400 uppercase mr-2 font-bold">Dept:</span>
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md uppercase tracking-wide">
                                            {emp.department}
                                        </span>
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 text-right">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
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
                                <td colSpan="4" className="px-6 py-12 text-center text-slate-400 text-sm">
                                    {isLoading ? 'Loading data...' : 'No employees found.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* LIVE System Activity Widget */}
        <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm p-6 flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
                        <FiShield size={18} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Live Activity</h3>
                        <p className="text-xs text-slate-400 font-medium">Real-time security logs</p>
                    </div>
                </div>
                <div className="flex gap-1">
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                </div>
            </div>
            
            <div className="relative space-y-0 pl-2 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[350px]">
                {/* Vertical Line */}
                <div className="absolute top-2 bottom-2 left-[19px] w-[2px] bg-slate-100 rounded-full"></div>

                {recentActivity && recentActivity.length > 0 ? (
                    recentActivity.map((log, i) => {
                        const style = getActionStyle(log.action);
                        return (
                            <div key={log._id || i} className="relative flex items-start gap-4 group mb-5 last:mb-0">
                                {/* Timeline Dot */}
                                <div className={`relative z-10 w-8 h-8 rounded-full border-2 border-white ${style.shadow} shadow-md flex items-center justify-center shrink-0 text-white ${style.bg} transition-transform group-hover:scale-110 duration-300`}>
                                    {style.icon}
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 pt-0.5 group-hover:translate-x-1 transition-transform duration-300">
                                    <div className="flex justify-between items-start">
                                        <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                            {style.label}
                                        </p>
                                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                                            <FiCalendar size={10} /> {formatTimeAgo(log.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed font-medium line-clamp-2" title={log.details}>
                                        {log.details}
                                    </p>
                                    <p className="text-[10px] text-indigo-400 mt-1 font-mono">
                                        by {log.user?.email?.split('@')[0] || 'System'}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-center text-slate-400">
                        <FiLayers size={24} className="mb-2 opacity-50"/>
                        <p className="text-sm">No recent activity recorded.</p>
                    </div>
                )}
            </div>
            
            {/* Redirect Button */}
            {user?.role === 'admin' && (
                <button 
                    onClick={() => navigate('/audit-logs')}
                    className="w-full mt-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all shadow-sm uppercase tracking-wider"
                >
                    View All Logs
                </button>
            )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;