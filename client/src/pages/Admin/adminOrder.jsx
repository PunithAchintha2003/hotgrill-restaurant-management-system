import React, { useState, useEffect } from "react";
import { FiPackage, FiUser, FiMail, FiPhone, FiMapPin, FiClock, FiDollarSign, FiEdit3, FiEye, FiFilter, FiCheck, FiX } from "react-icons/fi";
import Modal from "../../components/Modal";
import axios from "axios";
import toast from "react-hot-toast";

const AdminOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({});
    const [cancelReason, setCancelReason] = useState("");
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [pendingCancelOrderId, setPendingCancelOrderId] = useState(null);

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

    const orderStatuses = [
        { value: "all", label: "All Orders", color: "bg-gray-500" },
        { value: "pending", label: "Pending", color: "bg-yellow-500" },
        { value: "preparing", label: "Preparing", color: "bg-orange-500" },
        { value: "ready", label: "Ready", color: "bg-green-500" },
        { value: "delivered", label: "Delivered", color: "bg-blue-500" },
        { value: "cancelled", label: "Cancelled", color: "bg-red-500" }
    ];

    const fetchOrders = async (page = 1, status = "all") => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const statusQuery = status !== "all" ? `&status=${status}` : "";

            const response = await axios.get(
                `http://localhost:4000/api/payment/admin/orders?page=${page}&limit=10${statusQuery}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(currentPage, statusFilter);
    }, [currentPage, statusFilter]);

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                `http://localhost:4000/api/payment/admin/orders/${orderId}/status`,
                { orderStatus: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.data.success) {
                // Show success message based on status
                if (newStatus === 'ready') {
                    toast.success("Order marked as ready successfully!");
                } else if (newStatus === 'delivered') {
                    toast.success("Order marked as delivered successfully!");
                } else {
                    toast.success("Order status updated successfully!");
                }

                // Refresh orders
                fetchOrders(currentPage, statusFilter);
                setShowOrderDetails(false);
            }
        } catch (error) {
            console.error("Error updating order status:", error);
            toast.error(error.response?.data?.message || "Failed to update order status");
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

    const acceptOrder = async (orderId) => {
        showModal({
            title: "Accept Order",
            message: "Accept this order? This will move the order to 'Preparing' status and send an acceptance email to the customer.",
            type: "info",
            confirmText: "Yes, Accept",
            cancelText: "Cancel",
            showCancel: true,
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.put(
                        `http://localhost:4000/api/payment/admin/orders/${orderId}/accept`,
                        {},
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (response.data.success) {
                        toast.success("Order accepted successfully! Acceptance email sent to customer.");
                        fetchOrders(currentPage, statusFilter);
                        setShowOrderDetails(false);
                    }
                } catch (error) {
                    console.error("Error accepting order:", error);
                    toast.error(error.response?.data?.message || "Failed to accept order");
                }
            }
        });
    };

    const cancelOrder = async (orderId) => {
        setShowOrderDetails(false); // Close Order Details modal
        setPendingCancelOrderId(orderId);
        setShowReasonModal(true);
    };

    const handleCancelWithReason = async () => {
        if (!cancelReason.trim()) {
            showModal({
                title: "Reason Required",
                message: "Please enter a reason for cancellation",
                type: "warning",
                confirmText: "OK"
            });
            return;
        }

        setShowReasonModal(false);

        showModal({
            title: "Cancel Order",
            message: "Cancel this order? This will process a refund and send a cancellation email to the customer.",
            type: "warning",
            confirmText: "Yes, Cancel Order",
            cancelText: "No, Keep Order",
            showCancel: true,
            onConfirm: async () => {
                try {
                    const token = localStorage.getItem("token");
                    const response = await axios.put(
                        `http://localhost:4000/api/payment/admin/orders/${pendingCancelOrderId}/cancel`,
                        { reason: cancelReason },
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    if (response.data.success) {
                        toast.success(`Order cancelled successfully! Refund of LKR ${response.data.refundAmount.toFixed(2)} processed.`);
                        fetchOrders(currentPage, statusFilter);
                        setShowOrderDetails(false);
                        setCancelReason("");
                        setPendingCancelOrderId(null);
                    }
                } catch (error) {
                    console.error("Error cancelling order:", error);
                    toast.error(error.response?.data?.message || "Failed to cancel order");
                }
            }
        });
    };

    const getStatusColor = (status) => {
        const statusObj = orderStatuses.find(s => s.value === status);
        return statusObj ? statusObj.color : "bg-gray-500";
    };

    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#333333] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF991C] mx-auto mb-4"></div>
                    <p className="text-white">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#333333] py-8 px-4 sm:px-6 lg:px-8">
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

            {/* Reason Modal */}
            {showReasonModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#262626] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl">
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h3 className="text-xl font-bold text-white">Cancellation Reason</h3>
                            <button
                                onClick={() => {
                                    setShowReasonModal(false);
                                    setCancelReason("");
                                    setPendingCancelOrderId(null);
                                }}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <label className="block text-white/70 text-sm mb-2">
                                Please enter the reason for cancelling this order:
                            </label>
                            <textarea
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                placeholder="e.g., Out of stock, customer request, etc."
                                className="w-full bg-[#333333] border border-white/20 rounded-lg px-4 py-3 text-white placeholder-white/40 outline-none focus:border-[#FF991C] transition-colors resize-none"
                                rows="4"
                            />
                        </div>
                        <div className="p-6 border-t border-white/10 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowReasonModal(false);
                                    setCancelReason("");
                                    setPendingCancelOrderId(null);
                                }}
                                className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCancelWithReason}
                                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Order Management
                    </h1>
                    <p className="text-white/70">
                        Manage and track all customer orders
                    </p>
                </div>

                {/* Filters */}
                <div className="bg-black/15 rounded-2xl backdrop-blur-sm p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <FiFilter className="text-[#FF991C]" />
                        <h2 className="text-lg font-semibold text-white">Filter Orders</h2>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {orderStatuses.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => {
                                    setStatusFilter(status.value);
                                    setCurrentPage(1);
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${statusFilter === status.value
                                    ? `${status.color} text-white`
                                    : "bg-white/10 text-white/70 hover:bg-white/20"
                                    }`}
                            >
                                {status.label}
                            </button>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                        <p className="text-red-400">{error}</p>
                    </div>
                )}

                {/* Orders Table */}
                <div className="bg-black/15 rounded-2xl backdrop-blur-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-black/20">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                        Order ID
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                        Customer
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                        Items
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                        Total
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-white/70 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-mono text-white">
                                                #{order._id.slice(-8)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <div className="h-10 w-10 rounded-full bg-[#FF991C] flex items-center justify-center">
                                                        <FiUser className="text-white" />
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">
                                                        {order.customerDetails.name}
                                                    </div>
                                                    <div className="text-sm text-white/60">
                                                        {order.customerDetails.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-white">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-[#FF991C]">
                                                LKR {order.totalAmount.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                                            {new Date(order.orderDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button
                                                onClick={() => handleViewOrder(order)}
                                                className="text-[#FF991C] hover:text-white transition-colors mr-3"
                                            >
                                                <FiEye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                        <div className="px-6 py-4 border-t border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-white/70">
                                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, pagination.totalOrders)} of {pagination.totalOrders} orders
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={!pagination.hasPrev}
                                        className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-white">
                                        Page {currentPage} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                                        disabled={!pagination.hasNext}
                                        className="px-3 py-1 bg-white/10 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/20 transition-colors"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {orders.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <FiPackage className="w-16 h-16 text-white/30 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No orders found</h3>
                        <p className="text-white/60">
                            {statusFilter !== "all"
                                ? `No orders with status "${statusFilter}" found.`
                                : "No orders have been placed yet."
                            }
                        </p>
                    </div>
                )}
            </div>

            {/* Order Details Modal */}
            {showOrderDetails && selectedOrder && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#333333] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    Order Details
                                </h2>
                                <button
                                    onClick={() => setShowOrderDetails(false)}
                                    className="text-white/60 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Customer Information */}
                                <div className="bg-black/15 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <FiUser className="text-[#FF991C]" />
                                        Customer Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <FiUser className="text-white/60" />
                                            <span className="text-white">{selectedOrder.customerDetails.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiMail className="text-white/60" />
                                            <span className="text-white">{selectedOrder.customerDetails.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiPhone className="text-white/60" />
                                            <span className="text-white">{selectedOrder.customerDetails.phone}</span>
                                        </div>
                                        {selectedOrder.customerDetails.address.street && (
                                            <div className="flex items-start gap-2">
                                                <FiMapPin className="text-white/60 mt-1" />
                                                <div className="text-white">
                                                    <div>{selectedOrder.customerDetails.address.street}</div>
                                                    <div>{selectedOrder.customerDetails.address.city} {selectedOrder.customerDetails.address.postalCode}</div>
                                                    <div>{selectedOrder.customerDetails.address.country}</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Order Information */}
                                <div className="bg-black/15 rounded-xl p-6">
                                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                        <FiPackage className="text-[#FF991C]" />
                                        Order Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-white/60">Order ID: </span>
                                            <span className="text-white font-mono">#{selectedOrder._id}</span>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Order Date: </span>
                                            <span className="text-white">
                                                {new Date(selectedOrder.orderDate).toLocaleString()}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Total Amount: </span>
                                            <span className="text-[#FF991C] font-bold">
                                                LKR {selectedOrder.totalAmount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Payment Status: </span>
                                            <span className={`inline-block px-2 py-1 rounded text-xs text-white ${selectedOrder.paymentStatus === 'completed' ? 'bg-green-500' :
                                                selectedOrder.paymentStatus === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
                                                }`}>
                                                {selectedOrder.paymentStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-white/60">Order Status: </span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(selectedOrder.orderStatus)}`}>
                                                {selectedOrder.orderStatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mt-6 bg-black/15 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Order Items ({selectedOrder.items.length})
                                </h3>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between py-3 border-b border-white/10 last:border-b-0">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-16 h-16 rounded-lg object-cover"
                                                />
                                                <div>
                                                    <p className="text-white font-medium">{item.name}</p>
                                                    <p className="text-white/60 text-sm">
                                                        LKR {item.price.toFixed(2)} × {item.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                            <p className="text-[#FF991C] font-semibold">
                                                LKR {(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex gap-4">
                                {selectedOrder.orderStatus === 'pending' && selectedOrder.paymentStatus === 'completed' && (
                                    <button
                                        onClick={() => acceptOrder(selectedOrder._id)}
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiCheck className="w-5 h-5" />
                                        Accept Order
                                    </button>
                                )}
                                {selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'delivered' && (
                                    <button
                                        onClick={() => cancelOrder(selectedOrder._id)}
                                        className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                                    >
                                        <FiX className="w-5 h-5" />
                                        Cancel Order
                                    </button>
                                )}
                                {selectedOrder.orderStatus === 'preparing' && (
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'ready')}
                                        className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
                                    >
                                        Mark as Ready
                                    </button>
                                )}
                                {selectedOrder.orderStatus === 'ready' && (
                                    <button
                                        onClick={() => updateOrderStatus(selectedOrder._id, 'delivered')}
                                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
                                    >
                                        Mark as Delivered
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrder;