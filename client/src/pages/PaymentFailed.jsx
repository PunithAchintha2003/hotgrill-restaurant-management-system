import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import { FiXCircle, FiRefreshCw, FiArrowLeft, FiHelpCircle } from "react-icons/fi";
import axios from "axios";

const PaymentFailed = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const reason = searchParams.get("reason");
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("token");
                if (token && orderId) {
                    const response = await axios.get(
                        `http://localhost:4000/api/payment/order/${orderId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );
                    if (response.data.success) {
                        setOrder(response.data.order);
                    }
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    return (
        <>
            <Navigation />
            <div className="min-h-screen bg-linear-to-r from-[#333333] via-[#333333] to-[#333333] py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    {loading ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF991C] mx-auto mb-4"></div>
                            <p className="text-white">Loading order details...</p>
                        </div>
                    ) : (
                        <div className="text-center">
                            {/* Failed Icon */}
                            <div className="mb-8">
                                <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiXCircle className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    Payment Failed
                                </h1>
                                <p className="text-white/80 text-lg">
                                    We're sorry, but your payment could not be processed at this time.
                                </p>
                            </div>

                            {/* Error Information */}
                            <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-8">
                                <h2 className="text-lg font-semibold text-red-400 mb-3">
                                    What happened?
                                </h2>
                                {reason && (
                                    <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-4 mb-4">
                                        <p className="text-white font-medium text-sm">
                                            Error: {decodeURIComponent(reason)}
                                        </p>
                                    </div>
                                )}
                                <p className="text-white/80 text-sm mb-4">
                                    Your payment was not successful. This could be due to various reasons such as:
                                </p>
                                <ul className="text-left text-white/70 text-sm space-y-2 max-w-md mx-auto">
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        Insufficient funds in your account
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        Incorrect card information
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        Card expired or blocked
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-red-400">•</span>
                                        Network connectivity issues
                                    </li>
                                </ul>
                            </div>

                            {/* Order Details */}
                            {order && (
                                <div className="bg-black/15 rounded-2xl backdrop-blur-sm p-6 mb-8 text-left">
                                    <h2 className="text-xl font-semibold text-white mb-6">
                                        Order Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <p className="text-white/60 text-sm">Order ID</p>
                                            <p className="text-white font-mono">{order._id}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Total Amount</p>
                                            <p className="text-[#FF991C] font-bold text-lg">
                                                LKR {order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Payment Status</p>
                                            <span className="inline-block bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Order Status</p>
                                            <span className="inline-block bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/20 pt-6">
                                        <h3 className="text-lg font-medium text-white mb-4">Items in Your Cart</h3>
                                        <div className="space-y-3">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between py-2">
                                                    <div className="flex items-center gap-3">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name} 
                                                            className="w-12 h-12 rounded-lg object-cover"
                                                        />
                                                        <div>
                                                            <p className="text-white font-medium">{item.name}</p>
                                                            <p className="text-white/60 text-sm">Qty: {item.quantity}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-[#FF991C] font-semibold">
                                                        LKR {(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Help Section */}
                            <div className="bg-black/15 rounded-2xl backdrop-blur-sm p-6 mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FiHelpCircle className="text-[#FF991C]" />
                                    Need Help?
                                </h3>
                                <p className="text-white/80 text-sm mb-4">
                                    If you continue to experience issues, please contact our support team.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center text-sm">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <span>📞</span>
                                        <span>+94 11 234 5678</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <span>✉️</span>
                                        <span>support@hotgrill.lk</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/payment" 
                                    className="bg-[#FF991C] hover:bg-[#e08918] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <FiRefreshCw />
                                    Try Again
                                </Link>
                                <Link 
                                    to="/cart" 
                                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-white/20 flex items-center justify-center gap-2"
                                >
                                    <FiArrowLeft />
                                    Back to Cart
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-white/20"
                                >
                                    Contact Support
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default PaymentFailed;