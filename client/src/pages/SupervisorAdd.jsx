import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../services/api';
import { FiUserPlus, FiShield, FiCheckCircle, FiAlertCircle, FiArrowLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const SupervisorAdd = () => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <FiUserPlus className="text-indigo-600"/> Add Supervisor
            </h2>
            <p className="text-slate-500 text-sm">Create a new account with management privileges.</p>
        </div>
        <button onClick={() => navigate('/supervisors/manage')} className="text-sm font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors">
            <FiArrowLeft /> Back to List
        </button>
      </div>

      {/* Create Supervisor Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-bold text-slate-800">Account Details</h3>
                <p className="text-xs text-slate-500">Supervisors can manage employees but cannot access audit logs.</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center animate-pulse">
                <FiShield size={20} />
            </div>
        </div>
        
        <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
                
                {/* Email */}
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Supervisor Email</label>
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
                    {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium flex items-center gap-1"><FiAlertCircle/> {errors.email.message}</p>}
                </div>

                {/* Password */}
                <div>
                    <label className="text-sm font-bold text-slate-700 mb-2 block">Assign Password</label>
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
                    {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium flex items-center gap-1"><FiAlertCircle/> {errors.password.message}</p>}
                </div>

                {/* Feedback Messages */}
                {successMsg && (
                    <div className="p-4 bg-emerald-50 text-emerald-700 text-sm rounded-xl flex items-center gap-2 font-bold border border-emerald-100 animate-slide-up">
                        <FiCheckCircle size={18} /> {successMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className="p-4 bg-rose-50 text-rose-700 text-sm rounded-xl flex items-center gap-2 font-bold border border-rose-100 animate-slide-up">
                        <FiAlertCircle size={18} /> {errorMsg}
                    </div>
                )}

                {/* Submit */}
                <div className="pt-2">
                    <button 
                        type="submit" 
                        disabled={isSubmitting} 
                        className="btn-primary px-8 py-3.5 w-full md:w-auto justify-center"
                    >
                        {isSubmitting ? 'Creating Account...' : 'Create Supervisor'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
};

export default SupervisorAdd;