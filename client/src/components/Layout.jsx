import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { FiUsers, FiLogOut, FiMenu, FiGrid, FiSettings, FiX, FiSearch, FiBell } from 'react-icons/fi';
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
    { icon: <FiSettings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans text-slate-900">
      
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
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-8 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200">
                Z
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">Zevenstone</h1>
                <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest mt-0.5">HR Portal</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-slate-400">
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
            {menuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <div 
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-medium' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>}
                  <span className={`mr-3 transition-colors ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                </div>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-slate-100">
            <div className="bg-slate-50 rounded-2xl p-4 mb-2">
                <div className="flex items-center gap-3 mb-3">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user?.email || 'User'}&background=4F46E5&color=fff&rounded=true`} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.email?.split('@')[0]}</p>
                        <p className="text-xs text-slate-500 capitalize truncate">{user?.role}</p>
                    </div>
                </div>
                <button 
                onClick={handleLogout} 
                className="w-full flex items-center justify-center px-3 py-2 bg-white border border-slate-200 text-slate-600 hover:text-rose-600 hover:border-rose-200 rounded-xl transition-all duration-200 text-xs font-bold shadow-sm"
                >
                <FiLogOut className="mr-2" /> Sign Out
                </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
        
        {/* Top Navbar (Mobile only mostly) */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 px-6 h-20 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-slate-600 rounded-lg hover:bg-slate-100 transition">
               <FiMenu size={24} />
             </button>
             <h2 className="text-xl font-bold text-slate-800 hidden sm:block">Overview</h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition relative">
                <FiBell size={20} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <span className="text-sm font-medium text-slate-600 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;