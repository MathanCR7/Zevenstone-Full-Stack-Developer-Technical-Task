import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList'; // Import the new component
import Layout from './components/Layout';

const PrivateRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth);
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Route for the Summary Dashboard */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Route for the CRUD Table */}
        <Route path="employees" element={<EmployeeList />} /> 
        
        {/* Placeholder for settings */}
        <Route path="settings" element={<div className="p-8 text-slate-500 font-medium">Account Settings Module (Coming Soon)</div>} />
      </Route>
      
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;