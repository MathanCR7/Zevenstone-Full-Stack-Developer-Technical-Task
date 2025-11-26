import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuditLogs } from '../features/employeeSlice';
import { FiShield, FiActivity, FiUser, FiClock, FiTarget } from 'react-icons/fi';

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { logs, isLoading } = useSelector((state) => state.employees);

  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const getActionColor = (action) => {
      switch(action) {
          case 'CREATE': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
          case 'DELETE': return 'bg-rose-50 text-rose-600 border-rose-100';
          case 'UPDATE': return 'bg-amber-50 text-amber-600 border-amber-100';
          default: return 'bg-slate-50 text-slate-600 border-slate-100';
      }
  };

  return (
    <div className="animate-fade-in space-y-6">
        <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FiShield className="text-indigo-600"/> Security Audit Logs
            </h2>
            <p className="text-slate-500 text-sm">Track sensitive system modifications, user access, and operational history.</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400">
                    <span className="flex items-center gap-2 animate-pulse">Loading audit trail...</span>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Action Type</th>
                                <th className="p-4">Performed By</th>
                                <th className="p-4">Target Resource</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {logs.map((log) => (
                                <tr key={log._id} className="hover:bg-slate-50/80 transition-colors group">
                                    <td className="p-4 pl-6">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${getActionColor(log.action)}`}>
                                            <FiActivity/> {log.action}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                                <FiUser size={12}/>
                                            </div>
                                            <span className="font-semibold text-sm text-slate-700">{log.user?.email || 'Unknown User'}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                         <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <FiTarget size={14} className="text-slate-400"/>
                                            <span className="font-mono text-xs">{log.targetResource}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-sm text-slate-500 max-w-xs truncate" title={log.details}>
                                        {log.details}
                                    </td>
                                    <td className="p-4 text-xs text-slate-400 font-medium">
                                        <div className="flex items-center gap-1.5">
                                            <FiClock/>
                                            {new Date(log.createdAt).toLocaleString()}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-12 text-center text-slate-400 text-sm">No audit logs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    </div>
  );
};

export default AuditLogs;