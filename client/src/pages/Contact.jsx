import React, { useState } from "react";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import axios from "axios";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [status, setStatus] = useState(null);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/contact", formData);
            setStatus("success");
            setFormData({ name: "", email: "", subject: "", message: "" });
        } catch (error) {
            console.error("Error sending message", error);
            setStatus("error");
        }
    };

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-[#333333] via-[#333333] to-[#333333] py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Get in <span className="text-[#FF991C]">Touch</span>
                        </h2>
                        <p className="text-gray-300 text-lg">We'd love to hear from you. Send us a message or visit us!</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/10 flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 text-gray-300 group">
                                        <div className="bg-[#FF991C]/20 p-3 rounded-full group-hover:bg-[#FF991C] transition-colors duration-300">
                                            <FaPhone className="text-[#FF991C] group-hover:text-white text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">Phone</p>
                                            <p>+94 77 123 4567</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 text-gray-300 group">
                                        <div className="bg-[#FF991C]/20 p-3 rounded-full group-hover:bg-[#FF991C] transition-colors duration-300">
                                            <FaEnvelope className="text-[#FF991C] group-hover:text-white text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">Email</p>
                                            <p>info@hotgrill.lk</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 text-gray-300 group">
                                        <div className="bg-[#FF991C]/20 p-3 rounded-full group-hover:bg-[#FF991C] transition-colors duration-300">
                                            <FaMapMarkerAlt className="text-[#FF991C] group-hover:text-white text-xl" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white">Location</p>
                                            <p>123 Beach Road, Ahangama, Sri Lanka</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Mocked Map - Iframe */}
                            <div className="mt-8 h-64 w-full rounded-xl overflow-hidden border border-white/10">
                                <iframe 
                                    title="map"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63492.90562580749!2d80.20864383125001!3d6.053513600000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae173bb6932fce3%3A0x4a35b903f9c64c03!2sGalle%2C%20Sri%20Lanka!5e0!3m2!1sen!2slk!4v1683882932145!5m2!1sen!2slk" 
                                    width="100%" 
                                    height="100%" 
                                    style={{ border: 0 }} 
                                    allowFullScreen="" 
                                    loading="lazy" 
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-black/20 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                            <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
                            
                            {status === "success" && (
                                <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-200">
                                    Message sent successfully!
                                </div>
                            )}
                            {status === "error" && (
                                <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                                    Failed to send message. Please try again.
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2">Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#333333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                            placeholder="Your Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2">Email</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-[#333333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">Subject</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-[#333333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                        placeholder="Inquiry Subject"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">Message</label>
                                    <textarea 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows="4"
                                        className="w-full bg-[#333333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                        placeholder="How can we help you?"
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit" 
                                    className="w-full bg-[#FF991C] hover:bg-[#e08918] text-white font-bold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FaPaperPlane /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Contact;