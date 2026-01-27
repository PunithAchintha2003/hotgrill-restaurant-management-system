import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import axios from "axios";
import { FaCalendarAlt, FaClock, FaUserFriends, FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Reservations = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        date: "",
        time: "",
        guests: "2",
        notes: "",
        userId: null
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:4000/api/auth/me', {
                        headers: { 'x-auth-token': token }
                    });
                    setFormData(prev => ({
                        ...prev,
                        name: res.data.name,
                        email: res.data.email,
                        phone: res.data.contact,
                        userId: res.data._id
                    }));
                    setIsLoggedIn(true);
                } catch (err) {
                    console.error("Failed to fetch user data", err);
                }
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await axios.post("http://localhost:4000/api/reservations", formData);
            setStatus({ type: 'success', msg: 'Reservation request sent successfully! We will confirm shortly.' });
            if (!isLoggedIn) {
                setFormData({ name: "", email: "", phone: "", date: "", time: "", guests: "2", notes: "", userId: null });
            } else {
                // Keep user info, reset reservation details
                setFormData(prev => ({ ...prev, date: "", time: "", notes: "" }));
            }
        } catch (error) {
            setStatus({ type: 'error', msg: error.response?.data?.message || 'Failed to make reservation.' });
        } finally {
            setLoading(false);
        }
    };

    // Generate time slots
    const timeSlots = [];
    for(let i=11; i<=22; i++) {
        timeSlots.push(`${i}:00`);
        timeSlots.push(`${i}:30`);
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#333333]">
            <Navigation />
            
            <main className="flex-grow">
                {/* Hero Section */}
                <div className="bg-gradient-to-b from-[#333333] to-[#333333] py-16 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
                            Book a <span className="text-[#FF991C]">Table</span>
                        </h1>
                        <p className="text-white text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
                            Reserve your spot at HotGrill and prepare for an unforgettable dining experience.
                        </p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 pb-20">
                    <div className="bg-[#262626] rounded-[35px] p-8 md:p-12 border border-[#FF991C]/20 shadow-2xl">
                        
                        {status.msg && (
                            <div className={`p-4 rounded-xl mb-8 text-center font-medium ${
                                status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                            }`}>
                                {status.msg}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            
                            {/* Personal Info */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                                    <FaUserFriends className="text-[#FF991C]" /> Contact Details
                                </h3>
                                
                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        readOnly={isLoggedIn}
                                        className={`w-full bg-[#333333] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors ${isLoggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        readOnly={isLoggedIn}
                                        className={`w-full bg-[#333333] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors ${isLoggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        readOnly={isLoggedIn}
                                        className={`w-full bg-[#333333] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors ${isLoggedIn ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Reservation Details */}
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/10 pb-2">
                                    <FaUtensils className="text-[#FF991C]" /> Reservation Details
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Date</label>
                                        <div className="relative">
                                            <input 
                                                type="date" 
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                min={new Date().toISOString().split('T')[0]}
                                                className="w-full bg-[#333333] border border-gray-600 rounded-xl pl-3 pr-3 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Time</label>
                                        <div className="relative">
                                            <FaClock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                                            <select 
                                                name="time"
                                                value={formData.time}
                                                onChange={handleChange}
                                                className="w-full bg-[#333333] border border-gray-600 rounded-xl pl-3 pr-10 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors appearance-none"
                                                required
                                            >
                                                <option value="">Select Time</option>
                                                {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Number of Guests</label>
                                    <select 
                                        name="guests"
                                        value={formData.guests}
                                        onChange={handleChange}
                                        className="w-full bg-[#333333] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                    >
                                        {[1,2,3,4,5,6,7,8,9,10, "10+"].map(n => (
                                            <option key={n} value={n}>{n} People</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Special Requests</label>
                                    <textarea 
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        rows="3"
                                        placeholder="Allergies, high chair, special occasion..."
                                        className="w-full bg-[#333333] border border-gray-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors resize-none"
                                    ></textarea>
                                </div>
                            </div>

                            <div className="md:col-span-2 pt-4">
                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-[#FF991C] to-[#E9D967] hover:brightness-110 text-black font-black py-4 rounded-xl text-lg uppercase tracking-widest transition-all transform active:scale-95 shadow-lg shadow-orange-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Confirming...' : 'Confirm Reservation'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Reservations;