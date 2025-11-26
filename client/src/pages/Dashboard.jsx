import { useEffect, useState } from 'react';

// Mock Data (Replace with API call)
const mockEmployees = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer', status: 'Inactive' },
];

const Dashboard = () => {
  const [employees] = useState(mockEmployees);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Employees</h2>
        <button className="bg-primary text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
          + Add Employee
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {employees.map((emp) => (
              <tr key={emp.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-800">{emp.name}</td>
                <td className="p-4 text-gray-600">{emp.email}</td>
                <td className="p-4 text-gray-600">{emp.role}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button className="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {employees.map((emp) => (
          <div key={emp.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-gray-800">{emp.name}</h3>
                <p className="text-sm text-gray-500">{emp.role}</p>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full ${emp.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {emp.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{emp.email}</p>
            <div className="flex gap-2">
              <button className="flex-1 bg-gray-50 text-indigo-600 py-2 rounded-lg text-sm font-medium">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;