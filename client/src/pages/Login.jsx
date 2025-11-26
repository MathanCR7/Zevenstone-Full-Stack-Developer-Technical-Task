import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiLoader } from 'react-icons/fi';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { loading, error, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token) navigate('/dashboard');
    dispatch(clearError());
  }, [token, navigate, dispatch]);

  const onSubmit = async (data) => {
    dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen flex bg-white font-sans overflow-hidden">
      {/* Left Side - Artistic */}
      <div className="hidden lg:flex w-7/12 bg-slate-900 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-violet-900/90 z-10"></div>
        <img 
            src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1950&q=80" 
            alt="Office" 
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay" 
        />
        
        <div className="relative z-20 flex flex-col justify-between h-full p-20 text-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-xl border border-white/10">Z</div>
             <span className="text-2xl font-bold tracking-tight">Zevenstone</span>
          </div>
          
          <div className="mb-10">
            <h1 className="text-6xl font-bold mb-8 leading-tight tracking-tight">
                Manage your team <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-violet-200">with confidence.</span>
            </h1>
            <p className="text-indigo-100 text-lg max-w-lg leading-relaxed mb-10 opacity-90">
                Streamline your HR processes, track employee performance, and maintain a secure database in one unified platform designed for growth.
            </p>
            <div className="flex gap-4">
              <div className="feature-pill"><FiCheckCircle className="text-emerald-400" /> Secure Encryption</div>
              <div className="feature-pill"><FiCheckCircle className="text-emerald-400" /> Real-time Data</div>
              <div className="feature-pill"><FiCheckCircle className="text-emerald-400" /> 24/7 Support</div>
            </div>
          </div>

          <div className="text-sm text-indigo-200 opacity-60">
            © 2023 Zevenstone Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-5/12 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex justify-center mb-6">
                 <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-2xl">Z</div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-500">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-1.5 block">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input 
                    {...register("email", { required: "Email is required" })} 
                    className={`form-input pl-11 ${errors.email ? 'border-rose-300 ring-rose-200' : ''}`} 
                    placeholder="admin@zevenstone.com" 
                  />
                </div>
                {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    {...register("password", { required: "Password is required" })} 
                    className={`form-input pl-11 ${errors.password ? 'border-rose-300 ring-rose-200' : ''}`} 
                    placeholder="••••••••" 
                  />
                </div>
                {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl text-center font-medium border border-rose-100 flex items-center justify-center gap-2">
                <FiCheckCircle className="rotate-45" /> {typeof error === 'string' ? error : 'Login failed'}
              </div>
            )}

            <button 
                type="submit" 
                disabled={loading} 
                className="btn-primary w-full justify-center py-3.5 text-base"
            >
              {loading ? <><FiLoader className="animate-spin mr-2" /> Signing in...</> : <>Sign In <FiArrowRight className="ml-2" /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;