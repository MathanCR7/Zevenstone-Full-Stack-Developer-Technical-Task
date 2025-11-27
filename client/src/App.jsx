import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AuditLogs from './pages/AuditLogs';
import Layout from './components/Layout';
import SupervisorAdd from './pages/SupervisorAdd'; // Renamed from Settings
import SupervisorList from './pages/SupervisorList'; // New File

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
        
        {/* Admin Only Routes */}
        <Route path="audit-logs" element={
            <PrivateRoute roleRequired="admin">
                <AuditLogs />
            </PrivateRoute>
        } />
        
        {/* Supervisor Management Routes */}
        <Route path="supervisors/add" element={
            <PrivateRoute roleRequired="admin">
                <SupervisorAdd />
            </PrivateRoute>
        } />

        <Route path="supervisors/manage" element={
            <PrivateRoute roleRequired="admin">
                <SupervisorList />
            </PrivateRoute>
        } />
        
        {/* Redirect old settings to supervisors add for now or a general page */}
        <Route path="settings" element={<Navigate to="/supervisors/manage" replace />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;