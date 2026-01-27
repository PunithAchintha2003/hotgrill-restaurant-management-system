import React, { useState } from "react";
import {Link} from "react-router-dom";
import {useCart} from "../utils/CartContext";
import {FaPlus, FaMinus, FaTrash, FaTimes} from "react-icons/fa";

const CartItems = () => {

    const {cartItems, cartTotal, removeFromCart, updateQuantity} = useCart();
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#333333] via-[#333333] to-[#333333] ">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-left mb-12 animate-fade-in-down">
                    <span className="block text-2xl sm:text-3xl md:text-4xl mb-2 text-white bg-clip-text">
                        My Cart
                    </span>
                </h1>
                {cartItems.length === 0 ? (
                    <div className="text-center animate-fade-in">
                        <p className="text-white text-xl mb-4">Your cart is empty.</p>
                        <Link to="/menu" className="transition-all duration-150 text-white inline-flex items-center gap-2 hover:gap-3 bg-[#333333]/40 hover:bg-[#333333]/50 px-6 py-2 rounded-full text-sm uppercase border-2 border-white">Browse menu</Link>
                    </div>
                ) : (
                    <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                        {cartItems.map((item) => (
                            <div key={item.id} className="group bg-black/15 rounded-2xl backdrop-blur-sm flex flex-col items-center gap-4 transition-all duration-300 hover:shadow-xl hover:shadow-[#333333]/10 transform animate-fade-in p-0">
                                <div
                                    className="w-full h-50 flex-shrink-0 cursor-pointer relative overflow-hidden rounded-t-2xl transition-transform duration-300"
                                    onClick={() => setSelectedImage(item.image)}
                                >
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="w-full text-left p-4">
                                    <h3 className="text-xl text-white mb-2">{item.name}</h3>
                                    <p className="text-white/80 mt-1">LKR {item.price}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#333333]/50 transition-all duration-200 active:scale-95">
                                        <FaMinus className="w-4 h-4 text-white"/>
                                    </button>
                                    <span className="w-8 text-center text-white">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#333333]/50 transition-all duration-200 active:scale-95">
                                        <FaPlus className="w-4 h-4 text-white"/>
                                    </button>
                                </div>
                                <div className="flex items-center justify-between w-full px-4 pb-4">
                                    <span className="text-[#FF991C] font-semibold">LKR {item.price * item.quantity}</span>
                                    <button onClick={() => removeFromCart(item.id)} className="">
                                        <FaTrash className="w-5 h-5 text-white/80 hover:text-white transition-colors duration-200"/>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-12 pt-8 border-t border-white/70 animate-fade-in-up">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-white text-xl">Total: LKR {cartTotal}</span>
                            <Link to="/payment" className="inline-block text-center bg-[#FF991C]/80 hover:bg-[#FF991C] text-white p-4 rounded-full transition-all duration-200 active:scale-95">
                                Proceed to Checkout
                            </Link>
                        </div>
                    </div>
                    </>
                )}
            </div>
            {selectedImage && (
                <div className="fixed inset-0 bg-[#333333]/90 flex items-center justify-center z-50" onClick={() => setSelectedImage(null)}>
                    <div className="relative">
                        <img src={selectedImage} alt="large image" className="max-w-full max-h-full object-contain"/>
                        <button onClick={() => setSelectedImage(null)} className="absolute top-1 right-1 bg-white/80 text-black rounded-full p-2 hover:bg-white transition-colors duration-200 active:scale-95">
                            <FaTimes className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CartItems;