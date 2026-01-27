import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import { FiCheckCircle, FiPackage, FiClock, FiArrowRight } from "react-icons/fi";
import axios from "axios";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
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
                            {/* Success Icon */}
                            <div className="mb-8">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiCheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    Payment Successful!
                                </h1>
                                <p className="text-white/80 text-lg">
                                    Thank you for your order. Your payment has been processed successfully.
                                </p>
                            </div>

                            {/* Order Details */}
                            {order && (
                                <div className="bg-black/15 rounded-2xl backdrop-blur-sm p-6 mb-8 text-left">
                                    <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                                        <FiPackage className="text-[#FF991C]" />
                                        Order Details
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <p className="text-white/60 text-sm">Order ID</p>
                                            <p className="text-white font-mono">{order._id}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Order Date</p>
                                            <p className="text-white">
                                                {new Date(order.orderDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Total Amount</p>
                                            <p className="text-[#FF991C] font-bold text-lg">
                                                LKR {order.totalAmount.toFixed(2)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-white/60 text-sm">Payment Status</p>
                                            <span className="inline-block bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="border-t border-white/20 pt-6">
                                        <h3 className="text-lg font-medium text-white mb-4">Order Items</h3>
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

                            {/* Status Information */}
                            <div className="bg-black/15 rounded-2xl backdrop-blur-sm p-6 mb-8">
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <FiClock className="text-[#FF991C]" />
                                    What's Next?
                                </h3>
                                <div className="text-left space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-[#FF991C] rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-white font-medium">Order Confirmation</p>
                                            <p className="text-white/60 text-sm">
                                                You'll receive an email confirmation shortly with your order details.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-white/40 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-white font-medium">Order Preparation</p>
                                            <p className="text-white/60 text-sm">
                                                Our kitchen team will start preparing your delicious meal.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-2 h-2 bg-white/40 rounded-full mt-2"></div>
                                        <div>
                                            <p className="text-white font-medium">Ready for Pickup/Delivery</p>
                                            <p className="text-white/60 text-sm">
                                                We'll notify you when your order is ready.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    to="/menu" 
                                    className="bg-[#FF991C] hover:bg-[#e08918] text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    Continue Shopping
                                    <FiArrowRight />
                                </Link>
                                <Link 
                                    to="/" 
                                    className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 border border-white/20"
                                >
                                    Back to Home
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

export default PaymentSuccess;