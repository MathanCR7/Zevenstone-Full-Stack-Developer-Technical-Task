import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { FiUsers, FiLogOut, FiMenu } from 'react-icons/fi';
import { useState } from 'react';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Zevenstone</h1>
          <p className="text-sm text-gray-500 capitalize">{user?.role} Portal</p>
        </div>
        <nav className="p-4 space-y-2">
          <div className="flex items-center px-4 py-3 text-indigo-600 bg-indigo-50 rounded-lg cursor-pointer">
            <FiUsers className="mr-3" /> Employees
          </div>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition">
            <FiLogOut className="mr-3" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600">
            <FiMenu size={24} />
          </button>
          <span className="font-semibold text-gray-800">Employee Portal</span>
          <div className="w-6"></div> {/* Spacer */}
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;