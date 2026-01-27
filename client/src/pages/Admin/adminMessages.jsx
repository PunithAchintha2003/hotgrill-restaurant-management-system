import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get("http://localhost:4000/api/contact", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching messages", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const markAsRead = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:4000/api/contact/${id}/read`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchMessages(); // Refresh list
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    const deleteMessage = async (id) => {
        if (!window.confirm("Are you sure you want to delete this message?")) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:4000/api/contact/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessages(messages.filter(msg => msg._id !== id));
        } catch (error) {
            console.error("Error deleting message", error);
        }
    };

    return (
        <div className="min-h-screen bg-[#333333] py-8 px-4 sm:px-6 lg:px-8 text-white"> 
            <div className="max-w-7xl mx-auto">
                {loading ? (
                    <p className="text-white text-center">Loading messages...</p>
                ) : messages.length === 0 ? (
                    <p className="text-white text-center">No messages found</p>
                ) : (
                    <div className="grid gap-4">
                        {messages.map((msg) => (
                            <div 
                                key={msg._id} 
                                className={`p-6 rounded-xl border transition-all ${
                                    msg.isRead 
                                    ? 'bg-black/20 border-gray-700 opacity-75' 
                                    : 'bg-white/10 border-[#FF991C] shadow-lg'
                                }`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-xl font-bold">{msg.subject}</h3>
                                            {!msg.isRead && (
                                                <span className="bg-[#FF991C] text-xs px-2 py-0.5 rounded-full text-white">New</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-400">From: <span className="text-white">{msg.name}</span> ({msg.email})</p>
                                        <p className="text-xs text-gray-500 mt-1">{new Date(msg.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!msg.isRead && (
                                            <button 
                                                onClick={() => markAsRead(msg._id)}
                                                className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-full transition-colors"
                                                title="Mark as Read"
                                            >
                                                <FaCheckCircle size={20} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => deleteMessage(msg._id)}
                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-full transition-colors"
                                            title="Delete"
                                        >
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-black/20 p-4 rounded-lg text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminMessages;