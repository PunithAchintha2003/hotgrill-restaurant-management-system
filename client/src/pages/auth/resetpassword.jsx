import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from "react-icons/fi";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Retrieves the email passed from the ForgotPassword page
  const email = location.state?.email || ""; 
  
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });

  const handleReset = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      return alert("Passwords do not match!");
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: formData.newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Password updated successfully!");
        navigate("/login"); // Redirect to login after success
      } else {
        alert(data.msg || "Reset failed. Please try again.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      alert("Server error. Please check if your backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Glows to match theme */}
      <div className="absolute top-0 right-0 w-125 h-125 bg-[#FF991C] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-125 h-125 bg-[#E9D967] rounded-full blur-[150px] opacity-5"></div>

      <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 lg:p-12 max-w-md w-full border border-white/10 z-10 text-white text-center">
        
        <div className="mb-8">
          <h2 className="text-4xl font-black tracking-tight mb-2">
            New Password<span className="text-[#FF991C]">.</span>
          </h2>
          <p className="text-gray-400 text-sm font-medium italic">
            Resetting password for: <span className="text-white">{email}</span>
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-6 text-left">
          
          {/* New Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">New Password</label>
            <div className="relative group">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
              <input 
                type={showPass ? "text" : "password"} 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-4 bg-[#252525] border border-white/5 rounded-2xl text-white outline-none focus:border-[#FF991C]/50 transition-all"
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})} 
              />
              <button 
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#FF991C] hover:text-white transition-colors"
              >
                {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Confirm Password</label>
            <div className="relative group">
              <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-white/5 rounded-2xl text-white outline-none focus:border-[#FF991C]/50 transition-all"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-linear-to-r from-[#FF991C] to-[#E9D967] text-[#1a1a1a] font-black text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer group"
          >
            {loading ? "Updating..." : "Update Password"}
            {!loading && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;