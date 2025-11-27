import React from 'react';
import { useForm } from 'react-hook-form';
import { FiX, FiSave, FiUser, FiBriefcase, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const EmployeeForm = ({ onClose, onSubmit, initialData = {} }) => {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: initialData
  });

  const statusValue = watch("status", initialData.status || "active");

  return (
    // Z-INDEX 9999 ensures this sits on top of everything (Sidebar and Header)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6">
      
      {/* Backdrop with blur and fade animation */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-slide-up overflow-hidden border border-slate-100">
        
        {/* Decorative Top Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${initialData._id ? 'bg-amber-50 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                {initialData._id ? <FiUser size={20} /> : <FiUser size={20} />}
            </div>
            <div>
                <h3 className="text-xl font-bold text-slate-800">
                {initialData._id ? 'Edit Employee Profile' : 'Add New Employee'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                    {initialData._id ? 'Update employee details and permissions' : 'Create a new user account for your team'}
                </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-200"
          >
            <FiX size={22} />
          </button>
        </div>
        
        {/* Form Body - Scrollable */}
        <div className="p-6 overflow-y-auto custom-scrollbar bg-slate-50/30">
          <form id="empForm" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Section: Personal Info */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FiUser className="text-indigo-500" /> Personal Details
                </h4>
                
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-1.5 block">First Name <span className="text-rose-500">*</span></label>
                    <input 
                        {...register("firstName", { required: "First name is required" })} 
                        className={`form-input w-full px-4 py-2.5 rounded-xl border bg-slate-50 focus:bg-white transition-all duration-200 outline-none focus:ring-4 ${errors.firstName ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'}`} 
                        placeholder="e.g. John" 
                    />
                    {errors.firstName && <span className="text-rose-500 text-xs font-medium mt-1 flex items-center gap-1"><FiAlertCircle /> {errors.firstName.message}</span>}
                </div>
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-1.5 block">Last Name <span className="text-rose-500">*</span></label>
                    <input 
                        {...register("lastName", { required: "Last name is required" })} 
                        className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none" 
                        placeholder="e.g. Doe" 
                    />
                </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">Email Address <span className="text-rose-500">*</span></label>
                        <input 
                            type="email" 
                            {...register("email", { 
                                required: "Email is required",
                                pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" }
                            })} 
                            className={`form-input w-full px-4 py-2.5 rounded-xl border bg-slate-50 focus:bg-white transition-all duration-200 outline-none focus:ring-4 ${errors.email ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'}`} 
                            placeholder="john@company.com" 
                        />
                        {errors.email && <span className="text-rose-500 text-xs font-medium mt-1 flex items-center gap-1"><FiAlertCircle /> {errors.email.message}</span>}
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">Employee ID</label>
                        <input 
                            {...register("employeeId", { required: "ID is required" })} 
                            className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none font-mono disabled:opacity-60 disabled:cursor-not-allowed" 
                            placeholder="EMP-000" 
                            disabled={!!initialData._id} 
                        />
                    </div>
                </div>
            </div>

            {/* Section: Job Info */}
            <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <FiBriefcase className="text-indigo-500" /> Professional Info
                </h4>

                {/* Row 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">Department <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <select 
                                {...register("department", { required: "Please select a department" })} 
                                className="form-select w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Select Department</option>
                                <option value="IT">IT & Engineering</option>
                                <option value="HR">Human Resources</option>
                                <option value="Sales">Sales & Growth</option>
                                <option value="Marketing">Marketing</option>
                                <option value="Finance">Finance & Legal</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">Job Title <span className="text-rose-500">*</span></label>
                        <input 
                            {...register("role", { required: "Role is required" })} 
                            className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none" 
                            placeholder="e.g. Senior Developer" 
                        />
                    </div>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-2 block">Account Status</label>
                        <div className="flex bg-slate-100 p-1 rounded-xl">
                            <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${statusValue === 'active' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <input type="radio" value="active" {...register("status")} className="hidden" />
                                <FiCheckCircle size={16} /> Active
                            </label>
                            <label className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold cursor-pointer transition-all ${statusValue === 'inactive' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                <input type="radio" value="inactive" {...register("status")} className="hidden" />
                                <FiX size={16} /> Inactive
                            </label>
                        </div>
                    </div>
                    <div>
                        <label className="text-sm font-bold text-slate-700 mb-1.5 block">Joining Date <span className="text-rose-500">*</span></label>
                        {/* REMOVED EXTRA ICON: Native date picker icon will now show alone */}
                        <div className="relative">
                            <input 
                                type="date" 
                                {...register("dateOfJoining", { required: "Date is required" })} 
                                className="form-input w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none text-slate-600" 
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-sm font-bold text-slate-700 mb-1.5 block">Additional Notes <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <textarea 
                        {...register("notes")} 
                        className="form-textarea w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all duration-200 outline-none resize-none" 
                        rows="3" 
                        placeholder="Add any specific details regarding this employee..."
                    ></textarea>
                </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white flex justify-end gap-3 rounded-b-2xl">
            <button 
                type="button" 
                onClick={onClose} 
                className="px-6 py-2.5 text-slate-600 hover:text-slate-800 hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm transition-all focus:ring-4 focus:ring-slate-100"
            >
                Cancel
            </button>
            <button 
                form="empForm" 
                type="submit" 
                disabled={isSubmitting} 
                className="flex items-center gap-2 px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 focus:ring-4 focus:ring-indigo-100 transition-all disabled:opacity-70 transform active:scale-95"
            >
                {isSubmitting ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Saving...
                    </>
                ) : (
                    <>
                        <FiSave size={18} />
                        Save Employee
                    </>
                )}
            </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeForm;