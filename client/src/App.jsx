import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AuditLogs from './pages/AuditLogs'; // Import New Page
import Layout from './components/Layout';

const PrivateRoute = ({ children, roleRequired }) => {
  const { token, user } = useSelector((state) => state.auth);
  
  if (!token) return <Navigate to="/login" replace />;
  
  // RBAC for frontend routes
  if (roleRequired && user?.role !== roleRequired) {
      return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="employees" element={<EmployeeList />} /> 
        
        {/* Admin Only Route */}
        <Route path="audit-logs" element={
            <PrivateRoute roleRequired="admin">
                <AuditLogs />
            </PrivateRoute>
        } />
        
        <Route path="settings" element={<div className="p-8 text-slate-500 font-medium">Account Settings Module (Coming Soon)</div>} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;