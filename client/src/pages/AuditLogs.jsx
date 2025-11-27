// client/src/pages/AuditLogs.jsx
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

        <div className="bg-transparent md:bg-white md:rounded-2xl md:border border-slate-200 md:shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center text-slate-400 py-10">
                    <span className="flex items-center gap-2 animate-pulse">Loading audit trail...</span>
                </div>
            ) : (
                <div className="md:overflow-x-auto">
                    <table className="w-full text-left block md:table">
                        <thead className="hidden md:table-header-group bg-slate-50 border-b border-slate-200 text-[11px] uppercase font-bold text-slate-500 tracking-wider">
                            <tr>
                                <th className="p-4 pl-6">Action Type</th>
                                <th className="p-4">Performed By</th>
                                <th className="p-4">Target Resource</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Timestamp</th>
                            </tr>
                        </thead>
                        <tbody className="block md:table-row-group divide-y divide-slate-50">
                            {logs.map((log) => (
                                <tr key={log._id} className="block md:table-row bg-white rounded-2xl mb-4 p-5 shadow-sm md:shadow-none md:bg-transparent md:mb-0 md:p-0 hover:bg-slate-50/80 transition-colors group border border-slate-100 md:border-0 relative">
                                    <td className="block md:table-cell p-0 md:p-4 md:pl-6 mb-3 md:mb-0">
                                        <div className="flex items-center justify-between md:justify-start">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border ${getActionColor(log.action)}`}>
                                                <FiActivity/> {log.action}
                                            </span>
                                            {/* Mobile Timestamp shows top right */}
                                            <span className="md:hidden text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded">
                                                {new Date(log.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="block md:table-cell p-0 md:p-4 mb-2 md:mb-0">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                                                <FiUser size={12}/>
                                            </div>
                                            <span className="font-semibold text-sm text-slate-700">{log.user?.email || 'Unknown User'}</span>
                                        </div>
                                    </td>
                                    <td className="block md:table-cell p-0 md:p-4 mb-2 md:mb-0">
                                         <div className="flex items-center gap-2 text-slate-600 text-sm">
                                            <FiTarget size={14} className="text-slate-400 shrink-0"/>
                                            <span className="font-mono text-xs break-all">{log.targetResource}</span>
                                        </div>
                                    </td>
                                    <td className="block md:table-cell p-0 md:p-4 text-sm text-slate-500 max-w-xs truncate md:whitespace-nowrap mb-2 md:mb-0" title={log.details}>
                                        <span className="md:hidden text-xs font-bold text-slate-400 mr-2 uppercase">Details:</span>
                                        {log.details}
                                    </td>
                                    <td className="hidden md:table-cell p-4 text-xs text-slate-400 font-medium">
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