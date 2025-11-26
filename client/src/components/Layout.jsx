import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { FiUsers, FiLogOut, FiMenu, FiGrid, FiSettings, FiX, FiBell, FiShield, FiSearch } from 'react-icons/fi';
import { useState } from 'react';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const menuItems = [
    { icon: <FiGrid size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiUsers size={20} />, label: 'Employees', path: '/employees' },
    // Only show Audit Logs to Admin
    ...(user?.role === 'admin' ? [{ icon: <FiShield size={20} />, label: 'Audit Logs', path: '/audit-logs' }] : []),
    { icon: <FiSettings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50/50 font-sans text-slate-900">
      
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col p-4">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">
                Z
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Zevenstone</h1>
                <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest mt-1">Enterprise</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-slate-400">
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto mt-4">
            <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Platform</p>
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3.5 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden font-medium text-sm ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user?.email}&background=6366f1&color=fff&bold=true`} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.email?.split('@')[0]}</p>
                        <p className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wide mt-0.5">{user?.role}</p>
                    </div>
                </div>
                <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-100 rounded-xl transition-all duration-200 text-xs font-bold shadow-sm"
                >
                <FiLogOut /> Sign Out
                </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
        
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-8 h-20 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-2 text-slate-600 hover:bg-slate-100 p-2 rounded-lg">
               <FiMenu size={24} />
             </button>
             {/* Global Search Mockup */}
             <div className="hidden md:flex items-center gap-3 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 w-80 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <FiSearch className="text-slate-400 text-lg" />
                <input type="text" placeholder="Global search..." className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium" />
                <div className="flex gap-1">
                   <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">⌘</span>
                   <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400">K</span>
                </div>
             </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                <FiBell size={20} />
                <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                <p className="text-xs text-slate-400 font-medium">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;