import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaCheckDouble, FaStar, FaQuoteLeft } from "react-icons/fa";

const AdminReviews = () => {
    // 1. Initialize as empty array
    const [reviews, setReviews] = useState([]); 
    const [loading, setLoading] = useState(true);

    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const fetchReviews = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/reviews/all");
            
            // 2. Updated Data Handling Logic based on your log
            if (Array.isArray(res.data)) {
                // Direct array
                setReviews(res.data);
            } else if (res.data && Array.isArray(res.data.data)) {
                // Your specific case: { success: true, data: [...] }
                setReviews(res.data.data);
            } else if (res.data && Array.isArray(res.data.reviews)) {
                // Common alternative: { success: true, reviews: [...] }
                setReviews(res.data.reviews);
            } else {
                console.error("API Response format error: Expected array", res.data);
                setReviews([]);
            }
        } catch (error) {
            console.error("Error fetching reviews", error);
            setReviews([]); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this review?")) return;
        try {
            await axios.delete(`http://localhost:4000/api/reviews/${id}`, config);
            // Optimistic update
            setReviews(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            alert("Failed to delete review");
        }
    };

    const handleMarkRead = async (id) => {
        try {
            await axios.put(`http://localhost:4000/api/reviews/${id}/read`, {}, config);
            // Optimistic update
            setReviews(prev => prev.map(r => r._id === id ? { ...r, isRead: true } : r));
        } catch (error) {
            alert("Failed to update status");
        }
    };

    return (
        <div className="min-h-screen bg-[#333333] py-8 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl sm:text-3xl mb-8 text-white pl-4">
                    Food item reviews
                </h1>

                {loading ? (
                    <div className="text-center py-10">Loading reviews...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* 3. Render Safety */}
                        {Array.isArray(reviews) && reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div 
                                    key={review._id} 
                                    className={`relative p-6 rounded-2xl border transition-all duration-300 ${
                                        review.isRead 
                                        ? "bg-black/20 border-white/5 opacity-70" 
                                        : "bg-[#262626] border-[#FF991C]/50 shadow-lg shadow-orange-900/10"
                                    }`}
                                >
                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg text-white">{review.itemName}</h3>
                                            <div className="flex text-[#FF991C] text-sm mt-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={i < review.rating ? "" : "text-gray-600"} />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-500 bg-black/30 px-2 py-1 rounded">
                                            {new Date(review.date).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Comment */}
                                    <div className="mb-6 relative">
                                        <FaQuoteLeft className="absolute -top-1 -left-2 text-white/10 text-xl" />
                                        <p className="text-gray-300 text-sm pl-4 italic leading-relaxed line-clamp-4">
                                            "{review.comment}"
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-white/10">
                                        {!review.isRead && (
                                            <button 
                                                onClick={() => handleMarkRead(review._id)}
                                                className="flex items-center gap-2 px-3 py-2 bg-green-500/10 text-green-400 hover:bg-green-500/20 rounded-lg text-xs font-bold transition-colors"
                                            >
                                                <FaCheckDouble /> Mark Read
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => handleDelete(review._id)}
                                            className="flex items-center gap-2 px-3 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            <FaTrash /> Delete
                                        </button>
                                    </div>
                                    
                                    {!review.isRead && (
                                        <div className="absolute top-0 right-0 w-3 h-3 bg-[#FF991C] rounded-full animate-pulse mr-3 mt-3"></div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-500 py-10">
                                No reviews found.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;