import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiLoader, FiShield, FiTrendingUp, FiUsers } from 'react-icons/fi';

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
    <div className="min-h-screen flex w-full font-sans overflow-hidden bg-slate-50">
      
      {/* Left Side - Brand & Artistic Area */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 relative bg-slate-900 overflow-hidden">
        {/* Background Image with Parallax feel */}
        <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1950&q=80" 
                alt="Office Space" 
                className="w-full h-full object-cover opacity-40 mix-blend-overlay" 
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 via-violet-900/90 to-slate-900/95"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 xl:p-24 text-white">
          
          {/* Logo */}
          <div className="flex items-center gap-3 animate-fade-in">
             <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-lg flex items-center justify-center font-bold text-2xl border border-white/20 shadow-xl">
                Z
             </div>
             <span className="text-2xl font-bold tracking-tight text-white">Zevenstone</span>
          </div>
          
          {/* Main Copy */}
          <div className="max-w-2xl animate-slide-up">
            <h1 className="text-5xl xl:text-6xl font-extrabold mb-8 leading-tight tracking-tight drop-shadow-lg">
                Manage your team <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-indigo-200">with confidence.</span>
            </h1>
            <p className="text-indigo-100/90 text-lg xl:text-xl leading-relaxed mb-12 font-light">
                The all-in-one HR platform that streamlines processes, tracks performance, and secures your data—so you can focus on people, not paperwork.
            </p>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="feature-pill group hover:bg-white/20 transition-all cursor-default">
                  <FiShield className="text-emerald-400 text-lg group-hover:scale-110 transition-transform" /> 
                  <span className="font-medium">Bank-grade Security</span>
              </div>
              <div className="feature-pill group hover:bg-white/20 transition-all cursor-default">
                  <FiTrendingUp className="text-emerald-400 text-lg group-hover:scale-110 transition-transform" /> 
                  <span className="font-medium">Real-time Analytics</span>
              </div>
              <div className="feature-pill group hover:bg-white/20 transition-all cursor-default">
                  <FiUsers className="text-emerald-400 text-lg group-hover:scale-110 transition-transform" /> 
                  <span className="font-medium">Unlimited Users</span>
              </div>
            </div>
          </div>

          {/* Footer Copyright */}
          <div className="text-sm text-indigo-200/60 font-medium">
            © {new Date().getFullYear()} Zevenstone Inc. &nbsp;•&nbsp; Privacy Policy &nbsp;•&nbsp; Terms
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 xl:w-5/12 flex items-center justify-center p-6 sm:p-12 bg-white relative">
        
        {/* Decorative Ambient Blobs (Background) */}
        <div className="absolute top-[-10%] right-[-10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-violet-500/10 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="w-full max-w-[420px] space-y-10 relative z-20 animate-fade-in">
          
          {/* Mobile Logo (Visible only on small screens) */}
          <div className="lg:hidden flex flex-col items-center mb-8">
             <div className="w-14 h-14 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 flex items-center justify-center text-white font-bold text-3xl mb-4">Z</div>
             <h2 className="text-2xl font-bold text-slate-900">Zevenstone</h2>
          </div>

          {/* Header */}
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
            <p className="mt-3 text-slate-500 text-lg">Enter your credentials to access the portal.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-6">
              
              {/* Email Input */}
              <div className="group">
                <label className="text-sm font-bold text-slate-700 mb-2 block ml-1">Email Address</label>
                <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input 
                    {...register("email", { required: "Email is required" })} 
                    className={`form-input pl-11 py-4 bg-slate-50 border-slate-200 focus:bg-white shadow-sm hover:border-indigo-300 ${errors.email ? 'border-rose-300 ring-4 ring-rose-50 focus:border-rose-500' : ''}`} 
                    placeholder="admin@zevenstone.com" 
                  />
                </div>
                {errors.email && (
                    <p className="text-rose-500 text-xs mt-2 font-semibold flex items-center gap-1 ml-1 animate-fade-in">
                        <FiCheckCircle className="rotate-45" /> {errors.email.message}
                    </p>
                )}
              </div>

              {/* Password Input */}
              <div className="group">
                <div className="flex items-center justify-between mb-2 ml-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
                </div>
                <div className="relative transition-all duration-300 transform group-focus-within:-translate-y-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  </div>
                  <input 
                    type="password" 
                    {...register("password", { required: "Password is required" })} 
                    className={`form-input pl-11 py-4 bg-slate-50 border-slate-200 focus:bg-white shadow-sm hover:border-indigo-300 ${errors.password ? 'border-rose-300 ring-4 ring-rose-50 focus:border-rose-500' : ''}`} 
                    placeholder="••••••••" 
                  />
                </div>
                {errors.password && (
                    <p className="text-rose-500 text-xs mt-2 font-semibold flex items-center gap-1 ml-1 animate-fade-in">
                        <FiCheckCircle className="rotate-45" /> {errors.password.message}
                    </p>
                )}
              </div>
            </div>

            {/* Global Error Banner */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm rounded-xl text-center font-bold flex items-center justify-center gap-2 animate-slide-up shadow-sm">
                <FiCheckCircle className="rotate-45 text-lg" /> 
                {typeof error === 'string' ? error : 'Login failed. Please check credentials.'}
              </div>
            )}

            {/* Submit Button */}
            <button 
                type="submit" 
                disabled={loading} 
                className="w-full relative overflow-hidden group bg-indigo-600 text-white font-bold rounded-xl py-4 shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              <div className="flex items-center justify-center gap-2 relative z-10">
                  {loading ? (
                    <>
                        <FiLoader className="animate-spin text-xl" /> 
                        <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                        <span>Sign In</span> 
                        <FiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
              </div>
              {/* Shine effect on hover */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-shine" />
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-slate-500 text-sm font-medium">
            Don't have an account? <a href="#" className="text-indigo-600 font-bold hover:underline">Contact Admin</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;