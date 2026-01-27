import React, { useState, useEffect } from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import axios from "axios";
import toast from "react-hot-toast";
import { FaBox, FaCalendarAlt, FaReceipt, FaUserCog, FaTrash } from "react-icons/fa";
import { FiMail, FiLock, FiCheckCircle, FiEye, FiEyeOff, FiX } from "react-icons/fi";

const UserDashboard = () => {
    // Initialize as empty arrays to prevent map errors on first render
    const [orders, setOrders] = useState([]);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("orders");
    const [userData, setUserData] = useState(null);
    
    // Modal State
    const [modal, setModal] = useState({
        isOpen: false,
        title: "",
        message: "",
        type: "info",
        onConfirm: null,
        confirmText: "OK",
        cancelText: "Cancel",
        showCancel: false
    });
    
    // Account Details State
    const [emailUpdateStep, setEmailUpdateStep] = useState(1); // 1: form, 2: OTP
    const [passwordUpdateStep, setPasswordUpdateStep] = useState(1); // 1: form, 2: OTP
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [emailOtp, setEmailOtp] = useState("");
    const [passwordOtp, setPasswordOtp] = useState("");
    const [updating, setUpdating] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const config = { headers: { "Authorization": `Bearer ${token}`, "x-auth-token": token } };

                // 1. Fetch User Details
                const userRes = await axios.get("http://localhost:4000/api/auth/me", config);
                setUserData(userRes.data);

                // 2. Fetch Orders (Handle Object vs Array response)
                const ordersRes = await axios.get("http://localhost:4000/api/payment/my-orders", config);
                // Check if response is { orders: [...] } or just [...]
                const ordersData = Array.isArray(ordersRes.data) 
                    ? ordersRes.data 
                    : (ordersRes.data.orders || []); 
                setOrders(ordersData);

                // 3. Fetch Reservations
                const reservationsRes = await axios.get("http://localhost:4000/api/reservations/my-reservations", config);
                // Check if response is { reservations: [...] } or just [...]
                const reservationsData = Array.isArray(reservationsRes.data) 
                    ? reservationsRes.data 
                    : (reservationsRes.data.reservations || []);
                setReservations(reservationsData);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching dashboard data", error);
                setOrders([]); // Fallback to empty array on error
                setReservations([]);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
            case 'confirmed': return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
            case 'preparing': return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
            case 'ready': return 'bg-purple-500/20 text-purple-500 border-purple-500/30';
            case 'delivered': 
            case 'completed': return 'bg-green-500/20 text-green-500 border-green-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-500 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-500';
        }
    };

    const showModal = (config) => {
        setModal({
            isOpen: true,
            ...config
        });
    };

    const closeModal = () => {
        setModal({
            isOpen: false,
            title: "",
            message: "",
            type: "info",
            onConfirm: null,
            confirmText: "OK",
            cancelText: "Cancel",
            showCancel: false
        });
    };

    const cancelOrder = async (orderId) => {
        showModal({
            title: "Cancel Order",
            message: "Are you sure you want to cancel this order? If payment was completed, a refund will be processed.",
            type: "warning",
            confirmText: "Yes, Cancel Order",
            cancelText: "No, Keep Order",
            showCancel: true,
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    const config = { 
                        headers: { 
                            "Authorization": `Bearer ${token}`,
                            "x-auth-token": token 
                        } 
                    };

                    const response = await axios.put(
                        `http://localhost:4000/api/payment/order/${orderId}/cancel`,
                        { reason: "User requested cancellation" },
                        config
                    );

                    if (response.data.success) {
                        toast.success(response.data.message || "Order cancelled successfully");
                        
                        // Refresh orders
                        const ordersRes = await axios.get("http://localhost:4000/api/payment/my-orders", config);
                        const ordersData = Array.isArray(ordersRes.data) 
                            ? ordersRes.data 
                            : (ordersRes.data.orders || []); 
                        setOrders(ordersData);
                    }
                } catch (error) {
                    console.error("Error cancelling order:", error);
                    toast.error(error.response?.data?.message || "Failed to cancel order");
                }
            }
        });
    };

    const deleteOrder = async (orderId) => {
        showModal({
            title: "Delete Order",
            message: "Are you sure you want to delete this order? This action cannot be undone.",
            type: "warning",
            confirmText: "Yes, Delete",
            cancelText: "Cancel",
            showCancel: true,
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    const config = { 
                        headers: { 
                            "Authorization": `Bearer ${token}`,
                            "x-auth-token": token 
                        } 
                    };

                    const response = await axios.delete(
                        `http://localhost:4000/api/payment/order/${orderId}`,
                        config
                    );

                    if (response.data.success) {
                        toast.success(response.data.message || "Order deleted successfully");
                        
                        // Refresh orders
                        const ordersRes = await axios.get("http://localhost:4000/api/payment/my-orders", config);
                        const ordersData = Array.isArray(ordersRes.data) 
                            ? ordersRes.data 
                            : (ordersRes.data.orders || []); 
                        setOrders(ordersData);
                    }
                } catch (error) {
                    console.error("Error deleting order:", error);
                    toast.error(error.response?.data?.message || "Failed to delete order");
                }
            }
        });
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#333333]">
            <Navigation />
            
            {/* Modal */}
            <Modal
                isOpen={modal.isOpen}
                onClose={closeModal}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                onConfirm={modal.onConfirm}
                confirmText={modal.confirmText}
                cancelText={modal.cancelText}
                showCancel={modal.showCancel}
            />
            
            <main className="grow py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-4xl font-bold text-white mb-2">My Dashboard</h1>
                        {userData && (
                            <p className="text-white/60 text-lg">Welcome back, <span className="text-[#FF991C]">{userData.name}</span></p>
                        )}
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-[#FF991C]/20 flex items-center justify-center text-[#FF991C]">
                                <FaBox size={24} />
                            </div>
                            <div>
                                <h3 className="text-white text-lg font-medium">Total Orders</h3>
                                <p className="text-3xl font-bold text-white">{Array.isArray(orders) ? orders.length : 0}</p>
                            </div>
                        </div>
                        <div className="bg-black/20 border border-white/5 rounded-2xl p-6 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500">
                                <FaCalendarAlt size={24} />
                            </div>
                            <div>
                                <h3 className="text-white text-lg font-medium">Reservations</h3>
                                <p className="text-3xl font-bold text-white">{Array.isArray(reservations) ? reservations.length : 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-4 mb-8 border-b border-white/10 pb-1">
                        <button 
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-3 rounded-t-xl font-medium transition-all ${
                                activeTab === 'orders' 
                                ? 'bg-[#FF991C] text-white' 
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            My Orders
                        </button>
                        <button 
                            onClick={() => setActiveTab('reservations')}
                            className={`px-6 py-3 rounded-t-xl font-medium transition-all ${
                                activeTab === 'reservations' 
                                ? 'bg-[#FF991C] text-white' 
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            My Reservations
                        </button>
                        <button 
                            onClick={() => setActiveTab('account')}
                            className={`px-6 py-3 rounded-t-xl font-medium transition-all ${
                                activeTab === 'account' 
                                ? 'bg-[#FF991C] text-white' 
                                : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            Account Details
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="bg-[#262626] rounded-2xl p-6 border border-white/5 min-h-[400px]">
                        {loading ? (
                            <div className="text-center text-white/60 py-12">Loading data...</div>
                        ) : (
                            <>
                                {/* ORDERS TAB */}
                                {activeTab === 'orders' && (
                                    <div className="space-y-4">
                                        {/* Double check IsArray before mapping */}
                                        {!Array.isArray(orders) || orders.length === 0 ? (
                                            <p className="text-white/50 text-center py-12">No orders found.</p>
                                        ) : (
                                            orders.map((order) => (
                                                <div key={order._id} className="bg-black/20 border border-white/5 rounded-xl p-6 transition-all hover:border-[#FF991C]/30">
                                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <span className="text-[#FF991C] font-mono font-bold">#{order._id?.slice(-6).toUpperCase() || 'N/A'}</span>
                                                                <span className="text-white/40 text-sm">{order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus || 'pending')}`}>
                                                                    {(order.orderStatus || 'PENDING').toUpperCase()}
                                                                </span>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${order.paymentStatus === 'completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                                    {(order.paymentStatus || 'PENDING').toUpperCase()}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-white/40 text-sm">Total Amount</p>
                                                            <p className="text-2xl font-bold text-white">LKR {order.totalAmount?.toFixed(2) || '0.00'}</p>
                                                        </div>
                                                    </div>
                                                    {/* Items List */}
                                                    {order.items && order.items.length > 0 && (
                                                    <div className="border-t border-white/5 pt-4">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                            {order.items.map((item, idx) => (
                                                                <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
                                                                    {item.image && (
                                                                        <img src={item.image} alt={item.name || 'Item'} className="w-12 h-12 object-cover rounded-md" />
                                                                    )}
                                                                    <div>
                                                                        <p className="text-white font-medium text-sm">{item.name || 'Unknown Item'}</p>
                                                                        <p className="text-white/50 text-xs">Qty: {item.quantity || 0}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    )}
                                                    
                                                    {/* Action Buttons */}
                                                    <div className="border-t border-white/5 pt-4 mt-4 flex gap-3">
                                                        {/* Cancel Button - Show only for confirmed/pending orders */}
                                                        {(order.orderStatus === 'confirmed' || order.orderStatus === 'pending') && 
                                                         order.paymentStatus !== 'refunded' && (
                                                            <button
                                                                onClick={() => cancelOrder(order._id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-lg transition-all text-sm font-medium"
                                                            >
                                                                <FiX className="w-4 h-4" />
                                                                Cancel Order
                                                            </button>
                                                        )}
                                                        
                                                        {/* Delete Button - Show only for pending/failed/cancelled orders */}
                                                        {(['pending', 'cancelled'].includes(order.orderStatus) && 
                                                          ['pending', 'failed', 'refunded'].includes(order.paymentStatus)) && (
                                                            <button
                                                                onClick={() => deleteOrder(order._id)}
                                                                className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 border border-white/10 rounded-lg transition-all text-sm font-medium"
                                                            >
                                                                <FaTrash className="w-4 h-4" />
                                                                Delete
                                                            </button>
                                                        )}
                                                        
                                                        {/* Info message for orders that can't be cancelled */}
                                                        {order.orderStatus === 'preparing' && (
                                                            <p className="text-white/50 text-xs italic">
                                                                Order is being prepared. Contact support for cancellation.
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* RESERVATIONS TAB */}
                                {activeTab === 'reservations' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {!Array.isArray(reservations) || reservations.length === 0 ? (
                                            <p className="col-span-full text-white/50 text-center py-12">No reservations found.</p>
                                        ) : (
                                            reservations.map((res) => (
                                                <div key={res._id} className="bg-black/20 border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-[#FF991C]/30 transition-all">
                                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                                        <FaReceipt size={100} />
                                                    </div>
                                                    <div className="relative z-10">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Date</p>
                                                                <p className="text-xl font-bold text-white">{res.date ? new Date(res.date).toLocaleDateString() : 'N/A'}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Time</p>
                                                                <p className="text-xl font-bold text-[#FF991C]">{res.time}</p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="mb-4">
                                                            <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Guests</p>
                                                            <p className="text-white font-medium">{res.guests} People</p>
                                                        </div>

                                                        <div className="flex justify-between items-center border-t border-white/10 pt-4">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(res.status)}`}>
                                                                {res.status.toUpperCase()}
                                                            </span>
                                                            {res.tableNumber !== "Unassigned" && (
                                                                <span className="text-white/60 text-sm font-mono bg-white/5 px-2 py-1 rounded">
                                                                    Table: {res.tableNumber}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}

                                {/* ACCOUNT DETAILS TAB */}
                                {activeTab === 'account' && (
                                    <div className="space-y-8">
                                        {/* Current Account Info */}
                                        <div className="bg-black/20 border border-white/5 rounded-xl p-6">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-full bg-[#FF991C]/20 flex items-center justify-center text-[#FF991C]">
                                                    <FaUserCog size={20} />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">Account Information</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div>
                                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Current Email</p>
                                                    <p className="text-white font-medium">{userData?.email || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Name</p>
                                                    <p className="text-white font-medium">{userData?.name || 'N/A'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">Contact</p>
                                                    <p className="text-white font-medium">{userData?.contact || 'N/A'}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Update Sections Grid */}
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                            {/* Update Email Section */}
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                                <FiMail className="text-[#FF991C]" />
                                                Update Email Address
                                            </h3>
                                            
                                            {emailUpdateStep === 1 ? (
                                                <form onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    if (!newEmail || newEmail === userData?.email) {
                                                        toast.error('Please enter a new email address');
                                                        return;
                                                    }
                                                    
                                                    setUpdating(true);
                                                    try {
                                                        const token = localStorage.getItem("token");
                                                        const config = { 
                                                            headers: { 
                                                                "Authorization": `Bearer ${token}`, 
                                                                "x-auth-token": token,
                                                                "Content-Type": "application/json"
                                                            } 
                                                        };
                                                        
                                                        const response = await axios.post(
                                                            "http://localhost:4000/api/auth/account/send-otp",
                                                            { newEmail },
                                                            config
                                                        );
                                                        
                                                        if (response.data.msg) {
                                                            setEmailUpdateStep(2);
                                                            toast.success(`OTP sent to ${newEmail}. Please check your new email address.`);
                                                        }
                                                    } catch (error) {
                                                        toast.error(error.response?.data?.msg || 'Failed to send OTP. Please try again.');
                                                    } finally {
                                                        setUpdating(false);
                                                    }
                                                }} className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">New Email Address</label>
                                                        <div className="relative group">
                                                            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                                                            <input 
                                                                type="email" 
                                                                required 
                                                                value={newEmail}
                                                                onChange={(e) => setNewEmail(e.target.value)}
                                                                placeholder="newemail@example.com"
                                                                className="w-full pl-12 pr-4 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                                                            />
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type="submit" 
                                                        disabled={updating}
                                                        className="w-full bg-[#FF991C] text-white font-medium py-3 rounded-xl hover:bg-[#FF991C]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {updating ? 'Sending OTP...' : 'Send OTP to Email'}
                                                    </button>
                                                </form>
                                            ) : (
                                                <form onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    if (!emailOtp || emailOtp.length !== 6) {
                                                        toast.error('Please enter a valid 6-digit OTP');
                                                        return;
                                                    }
                                                    
                                                    setUpdating(true);
                                                    try {
                                                        const token = localStorage.getItem("token");
                                                        const config = { 
                                                            headers: { 
                                                                "Authorization": `Bearer ${token}`, 
                                                                "x-auth-token": token,
                                                                "Content-Type": "application/json"
                                                            } 
                                                        };
                                                        
                                                        const response = await axios.put(
                                                            "http://localhost:4000/api/auth/account/update-email",
                                                            { newEmail, otp: emailOtp },
                                                            config
                                                        );
                                                        
                                                        if (response.data.msg) {
                                                            toast.success(response.data.msg);
                                                            setNewEmail("");
                                                            setEmailOtp("");
                                                            setEmailUpdateStep(1);
                                                            // Refresh user data
                                                            const userRes = await axios.get("http://localhost:4000/api/auth/me", config);
                                                            setUserData(userRes.data);
                                                        }
                                                    } catch (error) {
                                                        toast.error(error.response?.data?.msg || 'Failed to update email. Please try again.');
                                                    } finally {
                                                        setUpdating(false);
                                                    }
                                                }} className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">OTP Code</label>
                                                        <div className="relative group">
                                                            <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                                                            <input 
                                                                type="text" 
                                                                maxLength="6"
                                                                required 
                                                                value={emailOtp}
                                                                onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, ''))}
                                                                placeholder="000000"
                                                                className="w-full pl-12 pr-4 py-3 bg-[#252525] border border-white/5 rounded-2xl text-center tracking-[0.5em] font-bold text-white outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                                                            />
                                                        </div>
                                                        <p className="text-white/50 text-xs mt-2">Enter the 6-digit OTP sent to {newEmail}</p>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setEmailUpdateStep(1);
                                                                setNewEmail("");
                                                                setEmailOtp("");
                                                            }}
                                                            className="flex-1 bg-white/5 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            disabled={updating}
                                                            className="flex-1 bg-[#FF991C] text-white font-medium py-3 rounded-xl hover:bg-[#FF991C]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {updating ? 'Updating...' : 'Update Email'}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                            </div>

                                            {/* Update Password Section */}
                                            <div className="bg-black/20 border border-white/5 rounded-xl p-6">
                                            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                                <FiLock className="text-[#FF991C]" />
                                                Update Password
                                            </h3>
                                            
                                            {passwordUpdateStep === 1 ? (
                                                <form onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    if (!newPassword || newPassword.length < 6) {
                                                        toast.error('Password must be at least 6 characters long');
                                                        return;
                                                    }
                                                    if (newPassword !== confirmPassword) {
                                                        toast.error('Passwords do not match');
                                                        return;
                                                    }
                                                    
                                                    setUpdating(true);
                                                    try {
                                                        const token = localStorage.getItem("token");
                                                        const config = { 
                                                            headers: { 
                                                                "Authorization": `Bearer ${token}`, 
                                                                "x-auth-token": token,
                                                                "Content-Type": "application/json"
                                                            } 
                                                        };
                                                        
                                                        const response = await axios.post(
                                                            "http://localhost:4000/api/auth/account/send-otp",
                                                            {},
                                                            config
                                                        );
                                                        
                                                        if (response.data.msg) {
                                                            setPasswordUpdateStep(2);
                                                            toast.success(response.data.msg);
                                                        }
                                                    } catch (error) {
                                                        toast.error(error.response?.data?.msg || 'Failed to send OTP. Please try again.');
                                                    } finally {
                                                        setUpdating(false);
                                                    }
                                                }} className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">New Password</label>
                                                        <div className="relative group">
                                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                                                            <input 
                                                                type={showNewPassword ? "text" : "password"} 
                                                                required 
                                                                value={newPassword}
                                                                onChange={(e) => setNewPassword(e.target.value)}
                                                                placeholder="Enter new password"
                                                                minLength="6"
                                                                className="w-full pl-12 pr-12 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF991C] transition-colors"
                                                            >
                                                                {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">Confirm Password</label>
                                                        <div className="relative group">
                                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                                                            <input 
                                                                type={showConfirmPassword ? "text" : "password"} 
                                                                required 
                                                                value={confirmPassword}
                                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                                placeholder="Confirm new password"
                                                                minLength="6"
                                                                className="w-full pl-12 pr-12 py-3 bg-[#252525] border border-white/5 rounded-2xl text-white placeholder-gray-600 outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#FF991C] transition-colors"
                                                            >
                                                                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <button 
                                                        type="submit" 
                                                        disabled={updating}
                                                        className="w-full bg-[#FF991C] text-white font-medium py-3 rounded-xl hover:bg-[#FF991C]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {updating ? 'Sending OTP...' : 'Send OTP to Email'}
                                                    </button>
                                                </form>
                                            ) : (
                                                <form onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    if (!passwordOtp || passwordOtp.length !== 6) {
                                                        toast.error('Please enter a valid 6-digit OTP');
                                                        return;
                                                    }
                                                    
                                                    setUpdating(true);
                                                    try {
                                                        const token = localStorage.getItem("token");
                                                        const config = { 
                                                            headers: { 
                                                                "Authorization": `Bearer ${token}`, 
                                                                "x-auth-token": token,
                                                                "Content-Type": "application/json"
                                                            } 
                                                        };
                                                        
                                                        const response = await axios.put(
                                                            "http://localhost:4000/api/auth/account/update-password",
                                                            { newPassword, otp: passwordOtp },
                                                            config
                                                        );
                                                        
                                                        if (response.data.msg) {
                                                            toast.success(response.data.msg);
                                                            setNewPassword("");
                                                            setConfirmPassword("");
                                                            setPasswordOtp("");
                                                            setShowNewPassword(false);
                                                            setShowConfirmPassword(false);
                                                            setPasswordUpdateStep(1);
                                                        }
                                                    } catch (error) {
                                                        toast.error(error.response?.data?.msg || 'Failed to update password. Please try again.');
                                                    } finally {
                                                        setUpdating(false);
                                                    }
                                                }} className="space-y-4">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500 ml-1">OTP Code</label>
                                                        <div className="relative group">
                                                            <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-[#FF991C] transition-colors" />
                                                            <input 
                                                                type="text" 
                                                                maxLength="6"
                                                                required 
                                                                value={passwordOtp}
                                                                onChange={(e) => setPasswordOtp(e.target.value.replace(/\D/g, ''))}
                                                                placeholder="000000"
                                                                className="w-full pl-12 pr-4 py-3 bg-[#252525] border border-white/5 rounded-2xl text-center tracking-[0.5em] font-bold text-white outline-none focus:border-[#FF991C]/50 focus:bg-[#2a2a2a] transition-all"
                                                            />
                                                        </div>
                                                        <p className="text-white/50 text-xs mt-2">Enter the 6-digit OTP sent to your current email address</p>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button 
                                                            type="button"
                                                            onClick={() => {
                                                                setPasswordUpdateStep(1);
                                                                setNewPassword("");
                                                                setConfirmPassword("");
                                                                setPasswordOtp("");
                                                                setShowNewPassword(false);
                                                                setShowConfirmPassword(false);
                                                            }}
                                                            className="flex-1 bg-white/5 text-white font-medium py-3 rounded-xl hover:bg-white/10 transition-all"
                                                        >
                                                            Cancel
                                                        </button>
                                                        <button 
                                                            type="submit" 
                                                            disabled={updating}
                                                            className="flex-1 bg-[#FF991C] text-white font-medium py-3 rounded-xl hover:bg-[#FF991C]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {updating ? 'Updating...' : 'Update Password'}
                                                        </button>
                                                    </div>
                                                </form>
                                            )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default UserDashboard;