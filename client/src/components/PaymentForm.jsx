import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { useCart } from "../utils/CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { FiCreditCard, FiUser, FiMail, FiPhone, FiMapPin, FiLock } from "react-icons/fi";
import axios from "axios";

// Initialize Stripe with error handling
const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

if (!stripePublishableKey) {
    console.error("⚠️ VITE_STRIPE_PUBLISHABLE_KEY is not defined in environment variables");
}

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const CheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();

    const [customerDetails, setCustomerDetails] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            street: "",
            city: "",
            postalCode: "",
            country: "Sri Lanka"
        }
    });

    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [cardError, setCardError] = useState(null);

    // Track if payment is being processed to prevent unwanted redirects
    const [isPaymentComplete, setIsPaymentComplete] = useState(false);

    // Check if cart is empty and redirect (but not during payment completion)
    useEffect(() => {
        if (cartItems.length === 0 && !isPaymentComplete) {
            navigate("/cart");
            return;
        }
    }, [cartItems, navigate, isPaymentComplete]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error when user starts typing
        if (error) {
            setError(null);
        }
        
        if (name.includes("address.")) {
            const addressField = name.split(".")[1];
            setCustomerDetails(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setCustomerDetails(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setProcessing(true);
        setError(null);

        // Validate customer details
        if (!customerDetails.name.trim()) {
            setError("Please enter your full name.");
            setProcessing(false);
            return;
        }

        if (!customerDetails.email.trim()) {
            setError("Please enter your email address.");
            setProcessing(false);
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerDetails.email)) {
            setError("Please enter a valid email address.");
            setProcessing(false);
            return;
        }

        if (!customerDetails.phone.trim()) {
            setError("Please enter your phone number.");
            setProcessing(false);
            return;
        }

        // Validate cart total
        if (cartTotal < 150) {
            setError("Minimum order amount is LKR 150.00");
            setProcessing(false);
            return;
        }

        // Validate card element
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError("Card information is required.");
            setProcessing(false);
            return;
        }

        try {
            // Create payment intent with customer details
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Please login to continue with payment.");
                setProcessing(false);
                setTimeout(() => navigate("/login"), 2000);
                return;
            }

            const response = await axios.post(
                `${API_URL}/api/payment/create-payment-intent`,
                {
                    amount: cartTotal,
                    currency: "lkr",
                    items: cartItems,
                    customerDetails
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            if (!response.data.success) {
                setError(response.data.message || "Failed to create payment intent");
                setProcessing(false);
                return;
            }

            const { clientSecret: newClientSecret, orderId: newOrderId } = response.data;

            // Confirm payment with Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
                newClientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: customerDetails.name,
                            email: customerDetails.email,
                            phone: customerDetails.phone,
                            address: {
                                line1: customerDetails.address.street,
                                city: customerDetails.address.city,
                                postal_code: customerDetails.address.postalCode,
                                country: "LK"
                            }
                        }
                    }
                }
            );

            if (stripeError) {
                console.error("Stripe payment error:", stripeError);
                setError(stripeError.message);
                setProcessing(false);
                
                // Redirect to payment failed page
                setTimeout(() => {
                    setIsPaymentComplete(true);
                    navigate(`/payment-failed?orderId=${newOrderId}&reason=${encodeURIComponent(stripeError.message)}`, { replace: true });
                }, 1500);
                return;
            }
            
            // Payment succeeded with Stripe
            console.log("Stripe payment succeeded:", paymentIntent.status);
            setIsPaymentComplete(true);

            // Attempt backend confirmation
            try {
                const confirmResponse = await axios.post(
                    `${API_URL}/api/payment/confirm-payment`,
                    {
                        paymentIntentId: paymentIntent.id,
                        orderId: newOrderId
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json"
                        }
                    }
                );
                console.log("Backend confirmation response:", confirmResponse.data);
                
                // Clear cart
                await clearCart();
                
                // Use window.location for hard redirect to prevent cart empty check
                window.location.href = `/payment-success?orderId=${newOrderId}`;
            } catch (confirmError) {
                console.error("Backend confirmation failed:", confirmError);
                // Still redirect to success since Stripe payment succeeded
                await clearCart();
                
                // Use window.location for hard redirect
                window.location.href = `/payment-success?orderId=${newOrderId}`;
            }
        } catch (error) {
            console.error("Error in payment process:", error);
            
            let errorMessage = "An unexpected error occurred. Please try again.";
            
            // Handle different types of errors
            if (error.response) {
                // Server responded with error
                errorMessage = error.response.data?.message || "Payment failed. Please try again.";
            } else if (error.request) {
                // Request was made but no response received
                errorMessage = "Unable to connect to payment server. Please check your internet connection.";
            } else {
                // Something else happened
                errorMessage = error.message || "An unexpected error occurred. Please try again.";
            }
            
            setError(errorMessage);
            setProcessing(false);
            
            // Redirect to payment failed page after showing error
            setTimeout(() => {
                setIsPaymentComplete(true);
                navigate(`/payment-failed?reason=${encodeURIComponent(errorMessage)}`, { replace: true });
            }, 1500);
        }
    };

    const handleCardChange = (event) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError(null);
        }
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#ffffff",
                "::placeholder": {
                    color: "#9ca3af"
                },
                backgroundColor: "transparent"
            },
            invalid: {
                color: "#ef4444"
            }
        },
        hidePostalCode: true
    };

    if (cartItems.length === 0) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#333333] via-[#333333] to-[#333333] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                    Complete Your <span className="text-[#FF991C]">Payment</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div className="bg-black/15 rounded-2xl backdrop-blur-sm p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <FiCreditCard className="text-[#FF991C]" />
                            Order Summary
                        </h2>

                        <div className="space-y-4 mb-6">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-2 border-b border-white/10">
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

                        <div className="border-t border-white/20 pt-4">
                            <div className="flex justify-between items-center text-xl font-bold text-white">
                                <span>Total:</span>
                                <div className="text-right">
                                    <div className="text-[#FF991C]">LKR {cartTotal.toFixed(2)}</div>
                                    <div className="text-sm text-white/60">≈ USD {(cartTotal / 300).toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="bg-black/15 rounded-2xl backdrop-blur-sm p-6">
                        <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                            <FiLock className="text-[#FF991C]" />
                            Payment Details
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white">Customer Information</h3>

                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Full Name"
                                        value={customerDetails.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[#333333] border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#FF991C] transition-colors"
                                    />
                                </div>

                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email Address"
                                        value={customerDetails.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[#333333] border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#FF991C] transition-colors"
                                    />
                                </div>

                                <div className="relative">
                                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        placeholder="Phone Number"
                                        value={customerDetails.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-[#333333] border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#FF991C] transition-colors"
                                    />
                                </div>

                                <div className="relative">
                                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60" />
                                    <input
                                        type="text"
                                        name="address.street"
                                        placeholder="Street Address"
                                        value={customerDetails.address.street}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-[#333333] border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#FF991C] transition-colors"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        name="address.city"
                                        placeholder="City"
                                        value={customerDetails.address.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#333333] border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#FF991C] transition-colors"
                                    />
                                    <input
                                        type="text"
                                        name="address.postalCode"
                                        placeholder="Postal Code"
                                        value={customerDetails.address.postalCode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-[#333333] border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:border-[#FF991C] transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Card Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium text-white">Card Information</h3>
                                <div className="p-4 bg-[#333333] border border-white/20 rounded-lg">
                                    <CardElement options={cardElementOptions} onChange={handleCardChange} />
                                </div>
                                {cardError && (
                                    <p className="text-red-400 text-sm mt-2">{cardError}</p>
                                )}
                            </div>

                            {error && (
                                <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                                    <p className="text-red-400 text-sm">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!stripe || processing}
                                className="w-full bg-[#FF991C] hover:bg-[#e08918] text-white font-bold py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {processing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiLock />
                                        Pay LKR {cartTotal.toFixed(2)} (≈ USD {(cartTotal / 300).toFixed(2)})
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-white/60 text-sm mb-2">
                                🔒 Your payment information is secure and encrypted
                            </p>
                            <p className="text-white/50 text-xs">
                                Minimum order: LKR 150.00 • Payments processed in USD
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PaymentForm = () => {
    // Show error message if Stripe is not configured
    if (!stripePromise) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-[#333333] via-[#333333] to-[#333333] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-black/15 rounded-2xl backdrop-blur-sm p-8 text-center">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Payment Configuration Error</h2>
                    <p className="text-white/80 mb-6">
                        Stripe payment is not configured. Please create a <code className="bg-black/30 px-2 py-1 rounded text-[#FF991C]">.env</code> file in the client directory with your Stripe publishable key:
                    </p>
                    <div className="bg-black/30 rounded-lg p-4 text-left">
                        <code className="text-sm text-white/90">
                            VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
                        </code>
                    </div>
                    <p className="text-white/60 text-sm mt-4">
                        Get your key from <a href="https://dashboard.stripe.com/test/apikeys" target="_blank" rel="noopener noreferrer" className="text-[#FF991C] hover:underline">Stripe Dashboard</a>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm />
        </Elements>
    );
};

export default PaymentForm;