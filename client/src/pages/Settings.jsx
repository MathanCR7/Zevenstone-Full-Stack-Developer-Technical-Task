import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { FiUserPlus, FiShield, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const Settings = () => {
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Only Admin can see this form
  if (user?.role !== 'admin') {
    return (
      <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-700">Settings</h3>
        <p className="text-slate-500">You do not have permission to view administrative settings.</p>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setSuccessMsg('');
    setErrorMsg('');
    try {
      await api.post('/auth/create-supervisor', {
        email: data.email,
        password: data.password
      });
      setSuccessMsg(`Supervisor ${data.email} created successfully!`);
      reset(); // Clear form
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create supervisor');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FiShield className="text-indigo-600"/> Admin Settings
        </h2>
        <p className="text-slate-500 text-sm">Manage system access and roles.</p>
      </div>

      {/* Create Supervisor Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Create Supervisor</h3>
                <p className="text-xs text-slate-500">Supervisors can manage employees but cannot access audit logs.</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <FiUserPlus size={20} />
            </div>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-5">
                
                {/* Email */}
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-1 block">Supervisor Email</label>
                    <input 
                        {...register("email", { 
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email format"
                            }
                        })} 
                        className="form-input" 
                        placeholder="supervisor@company.com" 
                    />
                    {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-1 block">Assign Password</label>
                    <input 
                        type="password"
                        {...register("password", { 
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })} 
                        className="form-input" 
                        placeholder="••••••••" 
                    />
                    {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
                </div>

                {/* Feedback Messages */}
                {successMsg && (
                    <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl flex items-center gap-2 font-medium">
                        <FiCheckCircle /> {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-xl flex items-center gap-2 font-medium">
                        <FiAlertCircle /> {errorMsg}
                    </div>
                )}

                {/* Submit */}
                <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="btn-primary px-6 py-3"
                >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;