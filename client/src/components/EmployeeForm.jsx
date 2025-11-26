import React from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiSave } from 'react-icons/fi';

const EmployeeForm = ({ onClose, onSubmit, initialData = {} }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              {initialData._id ? 'Edit Profile' : 'New Employee'}
            </h3>
            <p className="text-xs text-slate-500">Fill in the information below</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition">
            <FiX size={20} />
          </button>
        </div>
        
        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto">
          <form id="empForm" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">First Name</label>
                <input {...register("firstName", { required: "Required" })} className="form-input" placeholder="John" />
                {errors.firstName && <span className="text-rose-500 text-xs mt-1">{errors.firstName.message}</span>}
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Last Name</label>
                <input {...register("lastName", { required: "Required" })} className="form-input" placeholder="Doe" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Email Address</label>
                  <input type="email" {...register("email", { required: "Required" })} className="form-input" placeholder="john@example.com" />
                  {errors.email && <span className="text-rose-500 text-xs mt-1">{errors.email.message}</span>}
               </div>
               <div>
                  <label className="text-sm font-semibold text-slate-700 mb-1 block">Employee ID</label>
                  <input {...register("employeeId", { required: "Required" })} className="form-input" placeholder="EMP-001" disabled={!!initialData._id} />
               </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Department</label>
                <select {...register("department", { required: "Required" })} className="form-select">
                  <option value="">Select Department</option>
                  <option value="IT">IT</option>
                  <option value="HR">Human Resources</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Role / Title</label>
                <input {...register("role", { required: "Required" })} className="form-input" placeholder="e.g. Senior Developer" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="text-sm font-semibold text-slate-700 mb-1 block">Status</label>
                    <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="active" {...register("status")} className="text-indigo-600 focus:ring-indigo-500" defaultChecked />
                            <span className="text-sm text-slate-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="radio" value="inactive" {...register("status")} className="text-rose-600 focus:ring-rose-500" />
                            <span className="text-sm text-slate-700">Inactive</span>
                        </label>
                    </div>
                </div>
                <div>
                     <label className="text-sm font-semibold text-slate-700 mb-1 block">Date of Joining</label>
                     <input type="date" {...register("dateOfJoining", { required: "Required" })} className="form-input" />
                </div>
            </div>

            <div>
                <label className="text-sm font-semibold text-slate-700 mb-1 block">Notes (Optional)</label>
                <textarea {...register("notes")} className="form-textarea" rows="3" placeholder="Additional details..."></textarea>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-white border border-transparent hover:border-slate-200 rounded-xl font-medium transition-all">
                Cancel
            </button>
            <button form="empForm" type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-100 transition-all shadow-lg shadow-indigo-200 disabled:opacity-70">
                <FiSave size={18} />
                {isSubmitting ? 'Saving...' : 'Save Employee'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;