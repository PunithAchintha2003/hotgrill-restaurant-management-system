import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiArrowRight, FiArrowLeft, FiCheckCircle } from "react-icons/fi";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP from Backend
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.msg); // "OTP sent to your email"
        setStep(2);
      } else {
        alert(data.msg || "User not found");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Check if your server is running.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP with Backend
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      if (response.ok) {
        // Navigate to the final reset page
        navigate("/resetpassword", { state: { email } });
      } else {
        alert(data.msg || "Invalid OTP");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-125 h-125 bg-[#FF991C] rounded-full blur-[150px] opacity-10 animate-pulse"></div>
      
      <div className="relative bg-[#1a1a1a]/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl p-8 lg:p-12 max-w-md w-full border border-white/10 z-10 text-white">
        
        <button 
          onClick={() => step === 1 ? navigate("/login") : setStep(1)} 
          className="absolute left-6 top-6 text-gray-500 hover:text-[#FF991C] transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest cursor-pointer"
        >
          <FiArrowLeft /> {step === 1 ? "Back" : "Change Email"}
        </button>

        <div className="mb-8 mt-4 text-center">
          <h2 className="text-4xl font-black tracking-tight mb-2">
            {step === 1 ? "Recovery" : "Verify OTP"}<span className="text-[#FF991C]">.</span>
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            {step === 1 ? "Verify email to receive an OTP code." : `Enter the 6-digit code sent to ${email}`}
          </p>
        </div>

        <form onSubmit={step === 1 ? handleRequestOtp : handleVerifyOtp} className="space-y-6">
          {step === 1 ? (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="email" 
                  required 
                  className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-white/5 rounded-2xl outline-none focus:border-[#FF991C]/50 transition-all"
                  onChange={(e) => setEmail(e.target.value)} 
                />
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">OTP Code</label>
              <div className="relative group">
                <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input 
                  type="text" 
                  maxLength="6"
                  required 
                  placeholder="000000"
                  className="w-full pl-12 pr-4 py-4 bg-[#252525] border border-white/5 rounded-2xl outline-none focus:border-[#FF991C]/50 text-center tracking-[0.5em] font-bold"
                  onChange={(e) => setOtp(e.target.value)} 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-linear-to-r from-[#FF991C] to-[#E9D967] text-[#1a1a1a] font-black text-lg py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
          >
            {loading ? "Processing..." : step === 1 ? "Send OTP" : "Verify & Continue"}
            {!loading && <FiArrowRight />}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;