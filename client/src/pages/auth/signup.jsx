import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiLock, FiShield, FiArrowRight } from "react-icons/fi";
import signupImg from "../../assets/signup.jpg"; 

const Signup = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    contact: "", 
    password: "",
    confirmPassword: "",
    adminCode: "" 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.msg || "Account created successfully!");
        navigate("/login");
      } else {
        alert(data.msg || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      alert("Server error. Please check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-125 h-125 bg-[#FF991C] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-[#E9D967] rounded-full blur-[150px] opacity-5"></div>

      <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row max-w-5xl w-full overflow-hidden border border-white/10">
        
        <div className="w-full md:w-1/2 p-8 lg:p-12 flex flex-col justify-center z-10">
          <div className="mb-6">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">
              Join Us<span className="text-[#FF991C]">.</span>
            </h2>
            <p className="text-gray-400 text-sm font-medium">Create your HotGrill account and start ordering.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  className="w-full pl-12 pr-4 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                  onChange={(e) => setFormData({...formData, name: e.target.value})} 
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                <input 
                  type="email" 
                  required 
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
              </div>
            </div>

           
            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Contact Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                <input 
                  type="text" 
                  required 
                  placeholder="077 123 4567"
                  value={formData.contact} 
                  className="w-full pl-12 pr-4 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                  onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                />
              </div>
            </div>
          
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Password</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                  <input 
                    type={showPass ? "text" : "password"} 
                    required 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-10 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF991C] hover:text-white transition-colors">
                    {showPass ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Confirm</label>
                <div className="relative group">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                  <input 
                    type={showConfirm ? "text" : "password"} 
                    required 
                    placeholder="••••••••"
                    className="w-full pl-12 pr-10 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF991C] hover:text-white transition-colors">
                    {showConfirm ? <FiEyeOff size={16}/> : <FiEye size={16}/>}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="relative group">
                <FiShield className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" />
                <input 
                  type="text" 
                  placeholder="Staff Code (Optional)" 
                  className="w-full pl-12 p-2 text-[10px] bg-transparent border-b border-white/10 outline-none italic text-gray-500 focus:border-[#FF991C] transition-all" 
                  onChange={(e) => setFormData({...formData, adminCode: e.target.value})} 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-linear-to-r from-[#FF991C] to-[#E9D967] text-[#1a1a1a] font-black text-lg py-4 rounded-2xl shadow-xl shadow-orange-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group cursor-pointer"
            >
              {loading ? "Creating..." : "Create Account"}
              {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="mt-6 text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
            Already have an account? 
            <Link to="/login" className="text-white ml-2 hover:text-[#FF991C] transition-colors underline underline-offset-4 decoration-[#FF991C]">
              Sign In
            </Link>
          </p>
        </div>

        <div className="hidden md:block md:w-1/2 relative">
          <div className="absolute inset-0 bg-linear-to-r from-[#1a1a1a] to-transparent z-10 w-20"></div>
          <img 
            src={signupImg} 
            alt="HotGrill Interior" 
            className="h-full w-full object-cover" 
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Signup;