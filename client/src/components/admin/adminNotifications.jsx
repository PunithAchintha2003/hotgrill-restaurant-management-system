import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FaBell, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminNotifications = () => {
    const [notification, setNotification] = useState(null);
    const [audio] = useState(new Audio('/notification-sound.mp3'));

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
        const socket = io(API_URL);

        // Listen for the event name used in controllers
        socket.on("new_notification", (data) => {
            setNotification(data);
            setTimeout(() => setNotification(null), 9000);
        });

        return () => socket.disconnect();
    }, [audio]);

    if (!notification) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in-right">
            <div className="bg-[#333] border-l-4 border-[#FF991C] text-white p-4 rounded shadow-2xl flex items-start gap-4 max-w-sm">
                <div className="text-[#FF991C] mt-1">
                    <FaBell size={20} />
                </div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm uppercase tracking-wider mb-1">
                        New {notification.type}
                    </h4>
                    <p className="text-sm text-gray-300 mb-2">{notification.message}</p>
                    {notification.link && (
                        <Link 
                            to={notification.link} 
                            onClick={() => setNotification(null)}
                            className="text-xs font-bold text-[#FF991C] hover:underline"
                        >
                            View Details →
                        </Link>
                    )}
                </div>
                <button 
                    onClick={() => setNotification(null)} 
                    className="text-gray-500 hover:text-white"
                >
                    <FaTimes />
                </button>
            </div>
        </div>
    );
};

export default AdminNotifications;