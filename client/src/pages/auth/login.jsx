import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff } from 'react-icons/fi'; 
import loginImage from "../../assets/login.jpg"; 

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role); 

        window.dispatchEvent(new Event("auth-change"));

        if (data.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        alert(data.msg || "Login Failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden text-white font-sans">
      
      <div className="absolute top-0 left-0 w-125 h-125 bg-[#FF991C] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-[#E9D967] rounded-full blur-[150px] opacity-5"></div>

      <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden border border-white/10">
        
        <div className="w-full md:w-1/2 p-10 lg:p-16 flex flex-col justify-center z-10">
          <div className="mb-10">
            <h2 className="text-5xl font-black text-white tracking-tight mb-2">
              Sign In<span className="text-[#FF991C]">.</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium">Welcome back to HotGrill. Ready for your next meal?</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                <input 
                  type="email" 
                  className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                  placeholder="name@example.com"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Password</label>
                {/* CHANGED: button to Link for navigation */}
                <Link to="/forgetpassword" size={10} className="text-[10px] uppercase font-bold text-[#FF991C] hover:text-white transition-colors cursor-pointer">Forgot Password?</Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="w-full pl-12 pr-12 py-4 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                  placeholder="••••••••"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />

                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FF991C] hover:text-white transition-colors cursor-pointer p-1"
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-linear-to-r from-[#FF991C] to-[#E9D967] text-[#1a1a1a] font-black text-lg py-4 rounded-2xl shadow-xl shadow-orange-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
            >
              {loading ? "Authenticating..." : "Enter the Grill"}
              {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>

            <p className="mt-8 text-center text-gray-500 text-xs font-bold uppercase tracking-wider">
              New to HotGrill? 
              <Link 
                to="/signup" 
                className="text-white ml-2 hover:text-[#FF991C] transition-colors underline underline-offset-4 decoration-[#FF991C]"
              >
                Create Account
              </Link>
            </p>
          </form>
        </div>

        <div className="hidden md:block w-1/2 relative">
          <div className="absolute inset-0 bg-linear-to-r from-[#1a1a1a] to-transparent z-10 w-20"></div>
          <img 
            src={loginImage} 
            alt="HotGrill Special" 
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-10 left-10 right-10 z-20 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <FiCheckCircle className="text-[#FF991C]" />
              <span className="text-[10px] uppercase tracking-widest text-white font-bold">Verified Taste</span>
            </div>
            <p className="text-white text-xl font-medium leading-tight italic">
              "Experience the flame, taste the perfection."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;