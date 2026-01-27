import React, { useEffect, useState } from 'react';
import { FaStar, FaRegStar, FaCrown, FaSearch, FaQuoteLeft } from 'react-icons/fa';
import { GiGoldBar } from 'react-icons/gi';
import axios from 'axios';
import heroImage from '../assets/image 3.png';
import voucherImage from '../assets/image 4.png';

const ReviewsDisplay = () => {
  // --- 1. PLUG IN SECURITY CHECK HERE ---
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const isAdminUser = user?.role === 'admin';

  // --- STATE MANAGEMENT --- (DELETED the extra 'const ReviewsDisplay' line here)
  const [menuItems, setMenuItems] = useState([]); 
  const [reviews, setReviews] = useState([]);     
  const [loading, setLoading] = useState(true);  
  
  // New State for Load More (Starting with 1 review)
  const [displayLimit, setDisplayLimit] = useState(1); 

  // Search & Submission States
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [rating, setRating] = useState(0); 
  const [comment, setComment] = useState("");

  // --- 1. FETCH MENU ITEMS (For Dropdown) ---
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/menu');
        setMenuItems(response.data);
      } catch (error) {
        console.error("Failed to fetch menu items", error);
      }
    };
    fetchMenu();
  }, []);

  // --- 2. FETCH REVIEWS ---
  const fetchReviews = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/reviews/all");
      if (response.data.success) {
        setReviews(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // --- 3. FILTER REVIEWS (Last 3 for each food) ---
  const getFilteredReviews = () => {
    const reviewsToShow = [];
    const foodCounts = {};

    reviews.forEach((review) => {
      const foodName = review.itemName;
      if (!foodCounts[foodName]) {
        foodCounts[foodName] = 0;
      }
      if (foodCounts[foodName] < 3) {
        reviewsToShow.push(review);
        foodCounts[foodName]++;
      }
    });
    return reviewsToShow;
  };

  // APPLY DISPLAY LIMIT HERE
  const visibleReviews = getFilteredReviews().slice(0, displayLimit);

  // --- DROPDOWN FILTER LOGIC ---
  const filteredMenuItems = menuItems
    .map(item => item.name)
    .filter(name => name.toLowerCase().includes(searchTerm.toLowerCase()));

  // --- DELETE REVIEW LOGIC ---
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
        try {
            await axios.delete(`http://localhost:4000/api/reviews/${id}`);
            alert("Review removed.");
            fetchReviews(); 
        } catch (err) {
            alert("Could not delete.");
        }
    }
  }; 

  // --- SUBMIT REVIEW LOGIC ---
  const handlePublish = async () => {
    if (!searchTerm || rating === 0 || !comment) {
      alert("Please select a dish, give it a star rating, and write a comment!");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/reviews/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName: searchTerm,
          rating: rating,
          comment: comment
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("SUCCESS: Your review is now live!");
        setComment("");
        setRating(0);
        setSearchTerm("");
        fetchReviews(); 
      }
    } catch (error) {
      console.error("Connection Error:", error);
      alert("DATABASE ERROR: Could not save review.");
    }
  };

  // --- CSS ANIMATIONS ---
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
      @keyframes premiumSweep {
        0% { transform: translateX(-100%) skewX(-20deg); opacity: 0; }
        15% { opacity: 0.8; }
        35% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
        100% { transform: translateX(200%) skewX(-20deg); opacity: 0; }
      }
      .animate-float { animation: float 4s ease-in-out infinite; }
      .animate-sweep { animation: premiumSweep 7s infinite ease-in-out; }
      .luxury-grid {
        background-image: linear-gradient(#FFC145 0.3px, transparent 0.3px), linear-gradient(90deg, #FFC145 0.3px, transparent 0.3px);
        background-size: 50px 50px; opacity: 0.15;
      }
    `;
    document.head.appendChild(style);
    return () => { if (document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "0.0";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#222222] font-sans selection:bg-[#FFC145] selection:text-[#1A1A1A]">
      
      {/* BACKGROUND BLOBS */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-5%] w-[650px] h-[650px] bg-[#FFC145]/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[750px] h-[750px] bg-[#E8D965]/25 rounded-full blur-[140px]" />
        <div className="absolute inset-0 luxury-grid" />
        <div className="absolute inset-0 overflow-hidden">
          <div className="w-[30%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-sweep" />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        <header className="relative rounded-[35px] overflow-hidden mb-16 border border-[#FFC145]/30 bg-[#262626]/80 backdrop-blur-lg shadow-2xl transition-all duration-500 hover:scale-[1.01]">
          <div className="relative flex flex-col md:flex-row items-center p-6 md:p-10">
            <div className="md:w-1/2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-[#FFC145] text-[#1A1A1A] px-3 py-1.5 rounded-full mb-4 font-bold text-[10px] tracking-widest uppercase">
                <FaCrown /> PREMIUM EXPERIENCE
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 text-[#FFC145]">Taste Pure <br/><span className="text-white font-light italic">Excellence</span></h1>
              <p className="text-base text-gray-300 font-light mb-6 max-w-sm leading-relaxed">
                An exclusive culinary journey where artisanal flavors meet craftsmanship.
              </p>
            </div>
            <div className="md:w-1/2 p-4">
              <img src={heroImage} alt="Hero" className="w-full h-[320px] object-cover rounded-[30px] shadow-2xl border border-[#FFC145]/30" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            <div className="text-center p-10 bg-white/5 rounded-[40px] border border-white/10 animate-float shadow-xl backdrop-blur-md">
              <h2 className="text-gray-400 font-bold tracking-widest text-[11px] mb-4 uppercase">Overall Experience</h2>
              <span className="text-8xl md:text-9xl font-black text-[#FFC145] drop-shadow-[0_0_15px_rgba(255,193,69,0.4)]">
                {averageRating}
              </span>
              <div className="flex justify-center text-[#FFC145] text-3xl mb-4 mt-4">
                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="opacity-50"/>
              </div>
              <p className="text-gray-400 text-xs font-light italic">Based on {reviews.length} Verified Reviews</p>
              <div className="space-y-3 mt-8 pt-6 border-t border-white/10 text-left">
                {[ { s: 5, p: '60%' }, { s: 4, p: '20%' }, { s: 3, p: '15%' }, { s: 2, p: '3%' }, { s: 1, p: '2%' } ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4">
                    <span className="text-white text-xs font-black w-4">{item.s}★</span>
                    <div className="flex-grow bg-white/10 h-2 rounded-full overflow-hidden p-[1px]">
                      <div className="bg-gradient-to-r from-[#FFC145] to-[#E8D965] h-full rounded-full" style={{ width: item.p }}></div>
                    </div>
                    <span className="text-gray-400 text-[10px] font-bold w-8">{item.p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative rounded-[40px] overflow-hidden bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] border border-[#FFC145]/20 shadow-xl p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-4 text-[#FFC145]">
                  <GiGoldBar /> <span className="font-bold tracking-[0.3em] text-[10px]">EXCLUSIVE REWARD</span>
                </div>
                <h2 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter italic">Premium <span className="text-[#FFC145]">Vouchers</span></h2>
                <img src={voucherImage} alt="Voucher" className="w-full max-w-[200px] mx-auto drop-shadow-2xl mb-6" />
                <button className="bg-[#FFC145] text-black font-black py-4 px-10 rounded-full text-[10px] tracking-widest hover:bg-white transition-all shadow-xl w-full">
                  REDEEM EXPERIENCE
                </button>
            </div>
          </div>
          <div className="lg:col-span-8 space-y-12">
            <section className="bg-[#262626] rounded-[45px] p-8 md:p-12 border border-[#FFC145]/20 shadow-inner">
              <h4 className="text-xl font-black mb-8 text-white uppercase tracking-widest text-center">Share Your Culinary Voice</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="flex flex-col relative">
                      <label className="text-[#FFC145] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Find Menu Item</label>
                      <div className="relative group">
                          <input 
                              type="text"
                              className="w-full bg-white/5 border border-white/10 text-white p-3 pr-10 rounded-2xl outline-none focus:border-[#FFC145] transition-all text-sm"
                              placeholder="Type dish name..."
                              value={searchTerm}
                              onFocus={() => setIsDropdownOpen(true)}
                              onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <FaSearch className="absolute right-4 top-4 text-gray-500 text-sm group-focus-within:text-[#FFC145]" />
                      </div>
                      {isDropdownOpen && (
                          <div className="absolute top-[105%] left-0 w-full bg-[#2D2D2D] border border-[#FFC145]/40 rounded-2xl z-50 max-h-56 overflow-y-auto shadow-2xl backdrop-blur-xl">
                              {filteredMenuItems.length > 0 ? filteredMenuItems.map((name, idx) => (
                                  <div key={idx} className="p-4 text-sm text-gray-300 hover:bg-[#FFC145] hover:text-black cursor-pointer transition-all border-b border-white/5" onClick={() => { setSearchTerm(name); setIsDropdownOpen(false); }}>{name}</div>
                              )) : <div className="p-4 text-xs text-gray-500 italic text-center">No Matches found</div>}
                          </div>
                      )}
                  </div>
                  <div className="flex flex-col">
                      <label className="text-[#FFC145] text-[10px] font-bold tracking-[0.2em] uppercase mb-3">Star Power</label>
                      <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <button 
                                key={s} 
                                type="button"
                                onClick={() => setRating(s)} 
                                className={`flex-1 p-3 rounded-2xl transition-all shadow-lg border ${
                                    rating >= s 
                                    ? 'bg-[#FFC145] text-black border-[#FFC145]' 
                                    : 'bg-white/5 border-white/10 text-[#FFC145]'
                                }`} 
                            >
                                <FaStar className="mx-auto text-base" />
                            </button>
                        ))}
                      </div>
                  </div>
              </div>
              <textarea 
                  className="w-full bg-white/5 border border-white/10 text-white p-5 rounded-3xl mb-8 focus:border-[#FFC145] outline-none h-32 text-sm" 
                  placeholder="Tell us about the flavors..."
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)}
              ></textarea>
              <button 
                  onClick={handlePublish} 
                  className="w-full bg-gradient-to-r from-[#FFC145] to-[#E8D965] text-black font-black py-4 rounded-2xl text-[10px] tracking-[0.3em] uppercase hover:scale-[1.02] shadow-lg transition-all"
              >
                  Publish Premium Review
              </button>
            </section>

            <section>
              <div className="flex justify-between items-center mb-8 px-4">
                <h3 className="text-[#FFC145] font-black text-xl tracking-widest uppercase">Latest Experiences</h3>
                <span className="text-gray-500 text-xs italic">Showing recent verified reviews</span>
              </div>

              {loading ? (
                <div className="text-center text-[#FFC145] py-12 animate-pulse">Loading verified reviews...</div>
              ) : visibleReviews.length === 0 ? (
                <div className="text-center text-gray-500 py-12 border border-white/5 border-dashed rounded-[35px]">No reviews yet. Be the first!</div>
              ) : (
                <div className="space-y-8">
                  {visibleReviews.map((review, index) => (
                    <div key={review._id || index} className="group relative overflow-hidden rounded-[35px] border border-white/10 bg-white/5 backdrop-blur-md p-8 transition-all duration-500 hover:scale-[1.02] shadow-xl">
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                          <div>
                            <h5 className="text-white font-black text-2xl tracking-tight mb-1">Guest User</h5>
                            <div className="flex items-center gap-2 text-[#FFC145] text-[10px] font-bold tracking-widest uppercase opacity-80">
                                Ordered: <span className="text-white font-medium">{review.itemName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 bg-[#1A1A1A] px-4 py-2 rounded-2xl border border-[#FFC145]/20">
                            {[...Array(5)].map((_, i) => (
                              i < review.rating ? 
                              <FaStar key={i} className="text-[#FFC145] text-sm" /> : 
                              <FaRegStar key={i} className="text-gray-600 text-sm" />
                            ))}
                          </div>
                        </div>
                        <div className="relative pl-6">
                          <FaQuoteLeft className="absolute top-0 left-0 text-[#FFC145]/30 text-xl" />
                          <h6 className="text-[#FFC145] font-bold text-lg mb-3 italic">"{review.comment.substring(0, 50)}..."</h6>
                          <p className="text-gray-300 font-light leading-relaxed text-base mb-8">{review.comment}</p>
                        </div>
                        <div className="flex justify-between items-center pt-6 border-t border-white/5">
                          <small className="text-gray-500 text-[11px] font-medium uppercase">
                            {new Date(review.date).toLocaleDateString()} • Verified Guest
                          </small>
                          {/* ONLY show this button if the logged-in user is an Admin */}
                            {isAdminUser && (
                              <button 
                                onClick={() => handleDelete(review._id)} 
                                className="text-red-500 text-xs hover:underline ml-4"
                              >
                                Delete
                              </button>
                            )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* LOAD MORE BUTTON LOGIC */}
                  {visibleReviews.length < getFilteredReviews().length && (
                    <div className="flex justify-center mt-8">
                      <button 
                        onClick={() => setDisplayLimit(prev => prev + 3)}
                        className="text-[#FFC145] border border-[#FFC145] px-10 py-4 rounded-full font-black text-[10px] tracking-widest uppercase hover:bg-[#FFC145] hover:text-black transition-all shadow-xl hover:shadow-[#FFC145]/20"
                      >
                        Load More Experiences
                      </button>
                    </div>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsDisplay;