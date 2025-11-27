import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { 
  FiUsers, FiLogOut, FiMenu, FiGrid, FiSettings, FiX, 
  FiBell, FiShield, FiSearch, FiChevronRight, FiUser, 
  FiChevronDown, FiUserPlus, FiList, FiTrash2, FiLoader,
  FiAlertTriangle 
} from 'react-icons/fi';
import { useState, useRef, useEffect } from 'react';
import api from '../services/api';
import debounce from 'lodash.debounce';

// Define the logo path based on the public directory structure
const LOGO_PATH = '/Logo/logo.png';

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState(null);
  
  // --- Live Global Search State ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef(null);

  // Define Static Navigation Pages
  const staticPages = [
    { type: 'Page', label: 'Dashboard', path: '/dashboard', icon: <FiGrid /> },
    { type: 'Page', label: 'All Employees', path: '/employees', icon: <FiUsers /> },
    { type: 'Admin', label: 'Audit Logs', path: '/audit-logs', icon: <FiShield />, role: 'admin' },
    { type: 'Admin', label: 'Manage Supervisors', path: '/supervisors/manage', icon: <FiList />, role: 'admin' },
  ];

  // Dynamic Search Function
  const performSearch = async (query) => {
    if (!query) {
        setSearchResults([]);
        return;
    }
    setIsSearching(true);
    
    // Filter static pages locally based on Role
    const matchedPages = staticPages.filter(item => {
        if (item.role && user?.role !== item.role) return false;
        return item.label.toLowerCase().includes(query.toLowerCase());
    });

    try {
        // NOTE: Assuming API endpoint supports server-side filtering/search
        const { data } = await api.get(`/employees?search=${query}&limit=5`);
        
        const matchedEmployees = data.employees.map(emp => ({
            type: 'Employee',
            label: `${emp.firstName} ${emp.lastName}`,
            sub: emp.employeeId, // Displaying Employee ID or email
            path: `/employees/${emp._id}`, // Assuming a dynamic path for employee details
            icon: <FiUser />
        }));

        setSearchResults([...matchedPages, ...matchedEmployees]);
    } catch (error) {
        console.error("Search failed", error);
        // Fallback to only static pages if API fails
        setSearchResults(matchedPages);
    } finally {
        setIsSearching(false);
    }
  };

  const debouncedSearch = useRef(debounce((query) => performSearch(query), 300)).current;

  const handleSearchInput = (e) => {
      const val = e.target.value;
      setSearchTerm(val);
      if(val.length > 0) {
          setIsSearchOpen(true);
          debouncedSearch(val);
      } else {
          setIsSearchOpen(false);
      }
  };

  const handleSearchNavigation = (path) => {
    navigate(path);
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Updated Logout Handler with custom confirmation dialog simulation
  const handleLogout = () => {
    const confirmation = window.confirm('Are you sure you want to sign out? This will end your current session.');
    
    if (confirmation) {
        dispatch(logout());
        navigate('/login');
    }
  };

  const toggleSubMenu = (label) => {
    setExpandedMenu(expandedMenu === label ? null : label);
  };

  // Define navigation structure based on roles
  const menuItems = [
    { icon: <FiGrid size={18} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <FiUsers size={18} />, label: 'Employees', path: '/employees' },
    
    // Only show Audit Logs to Admin
    ...(user?.role === 'admin' ? [{ icon: <FiShield size={18} />, label: 'Audit Logs', path: '/audit-logs' }] : []),
    
    // Only show Supervisors Menu to Admin
    ...(user?.role === 'admin' ? [{ 
        icon: <FiSettings size={18} />, 
        label: 'Admin Tools', 
        isDropdown: true,
        subItems: [
            { label: 'Add Supervisor', path: '/supervisors/add', icon: <FiUserPlus size={16}/> },
            { label: 'Manage Supervisors', path: '/supervisors/manage', icon: <FiList size={16}/> }
        ]
    }] : []),
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
          
          {/* LOGO SECTION - Updated with Image Path */}
          <div className="h-16 flex items-center px-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-indigo-200 p-1.5 border border-slate-100">
                <img 
                    src={LOGO_PATH} 
                    alt="Zevenstone Logo" 
                    className="w-full h-full object-contain" 
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-none">Employee Portal</h1>
                <p className="text-[10px] uppercase font-bold text-indigo-500 tracking-widest mt-1">Zevenstone</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="md:hidden ml-auto text-slate-400 p-1 hover:bg-slate-100 rounded">
              <FiX size={24} />
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto mt-4 pr-2 custom-scrollbar">
            <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Navigation</p>
            {menuItems.map((item) => {
              if (item.isDropdown) {
                  const isExpanded = expandedMenu === item.label;
                  const isActiveParent = item.subItems.some(sub => location.pathname.startsWith(sub.path));
                  
                  return (
                    <div key={item.label} className="mb-1">
                        <div 
                            onClick={() => toggleSubMenu(item.label)}
                            className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden font-medium text-sm select-none justify-between ${
                                isActiveParent ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            <div className="flex items-center">
                                <span className={`mr-3 ${isActiveParent ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                                    {item.icon}
                                </span>
                                <span>{item.label}</span>
                            </div>
                            <FiChevronDown className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-indigo-600' : 'text-slate-400'}`} />
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                            {item.subItems.map(sub => {
                                const isSubActive = location.pathname.startsWith(sub.path);
                                return (
                                    <Link 
                                        key={sub.label}
                                        to={sub.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center pl-11 pr-4 py-2.5 rounded-xl text-sm transition-all mb-0.5 ${
                                            isSubActive 
                                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-medium' 
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600 hover:pl-12'
                                        }`}
                                    >
                                        <span className="mr-2 opacity-70">{sub.icon}</span>
                                        {sub.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                  );
              }
              const isActive = location.pathname.startsWith(item.path) && (location.pathname.length === item.path.length || location.pathname.charAt(item.path.length) === '/');
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group relative overflow-hidden font-medium text-sm mb-1 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-200' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && <FiChevronRight className="ml-auto text-indigo-300 opacity-50" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile & Logout Section (Enhanced Style) */}
          <div className="mt-auto pt-4 border-t border-slate-100">
            <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                    <img 
                        src={`https://ui-avatars.com/api/?name=${user?.email}&background=6366f1&color=fff&bold=true`} 
                        alt="Profile" 
                        className="w-9 h-9 rounded-full border-2 border-white shadow-sm"
                    />
                    <div className="overflow-hidden min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">{user?.email?.split('@')[0]}</p>
                        <p className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full inline-block uppercase tracking-wide mt-0.5">{user?.role}</p>
                    </div>
                </div>
                
                {/* ATTRACTIVE LOGOUT BUTTON */}
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-xl transition-all duration-200 text-xs font-bold shadow-sm group"
                >
                   <FiLogOut className="text-sm group-hover:scale-105 transition-transform" /> 
                   Sign Out
                </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 md:pl-72 transition-all duration-300">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-6 md:px-8 h-16 border-b border-slate-200/60 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
             <button onClick={() => setSidebarOpen(true)} className="md:hidden -ml-2 text-slate-600 hover:bg-slate-100 p-2 rounded-lg">
               <FiMenu size={20} />
             </button>

             {/* LIVE SEARCH COMPONENT */}
             <div className="relative w-full max-w-md" ref={searchRef}>
                 <div className="hidden md:flex items-center gap-3 px-3 py-2 bg-slate-100/50 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:bg-white transition-all">
                    {isSearching ? <FiLoader className="animate-spin text-indigo-600" /> : <FiSearch className="text-slate-400 text-lg" />}
                    
                    <input 
                        type="text" 
                        placeholder="Search employees, pages, or settings (⌘K)" 
                        className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 font-medium text-slate-700"
                        value={searchTerm}
                        onChange={handleSearchInput}
                        onFocus={() => { if(searchTerm.length > 0) setIsSearchOpen(true); }}
                    />
                    <div className="flex gap-1">
                       <span className="text-[10px] font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 text-slate-400 shadow-sm hidden lg:block">⌘K</span>
                    </div>
                 </div>

                 {/* DROPDOWN RESULTS */}
                 {isSearchOpen && searchTerm.length > 0 && (
                     <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-slide-up z-50">
                         <div className="p-2">
                             <p className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                 {searchResults.length > 0 ? 'Search Results' : 'No Matches'}
                             </p>
                             
                             {isSearching && searchResults.length === 0 ? (
                                 <div className="px-3 py-4 text-center text-sm text-indigo-500 flex items-center justify-center gap-2">
                                     <FiLoader className="animate-spin" /> Searching...
                                 </div>
                             ) : searchResults.length > 0 ? (
                                 searchResults.map((item, index) => (
                                     <div 
                                        key={index}
                                        onClick={() => handleSearchNavigation(item.path)}
                                        className="flex items-center gap-3 px-3 py-2.5 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors group"
                                     >
                                         <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${item.type === 'Page' || item.type === 'Admin' ? 'bg-slate-100 text-slate-500' : 'bg-indigo-100 text-indigo-600'}`}>
                                            {item.icon || <FiUser />}
                                         </div>
                                         <div className="flex-1 overflow-hidden">
                                             <p className="text-sm font-semibold text-slate-700 group-hover:text-indigo-700 truncate">{item.label}</p>
                                             {item.sub && <p className="text-xs text-slate-400 truncate">{item.sub}</p>}
                                         </div>
                                         <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${item.type === 'Employee' ? 'bg-indigo-500' : 'bg-slate-500'}`}>{item.type}</span>
                                     </div>
                                 ))
                             ) : (
                                 <div className="px-3 py-4 text-center text-sm text-slate-400">
                                     <FiAlertTriangle className="inline mr-1" /> No results found for "{searchTerm}"
                                 </div>
                             )}
                         </div>
                     </div>
                 )}
             </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors bg-white border border-slate-100 rounded-lg shadow-sm">
                <FiBell size={18} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-700">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;