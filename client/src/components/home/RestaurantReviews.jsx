import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const RestaurantReviews = () => {
  return (
    <section className="bg-gradient-to-b from-[#333333] to-[#333333] text-white py-8 md:py-15 px-2 md:px-4 shadow-[0_25px_50px_-12px] shadow-[#333333]/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="flex flex-col items-center justify-center gap-5 md:gap-6 lg:gap-8 min-h-[220px] md:min-h-[260px] lg:min-h-[300px]">
          {/* Review 1 */}
          <div className="w-full max-w-xl bg-white text-[#333333] px-6 md:px-8 lg:px-12 py-3 md:py-4 lg:py-5 rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[#333333]/40">
            <h5 className="text-base md:text-lg font-semibold mb-0.5">John Doe</h5>
            <hr className="h-[2px] w-full rounded-full border-none bg-black mb-1" />
            <div className="flex gap-0.5 mb-1">
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
            </div>
            <h4 className="text-xs md:text-sm font-medium mb-0.5">Excellent food and service!</h4>
            <p className="text-xs md:text-sm text-[#333333]/80">
              "I had an amazing dining experience at Hotgrill. The food was delicious, and the staff were incredibly attentive. Highly recommend!"
            </p>
          </div>
          {/* Review 2 */}
          <div className="w-full max-w-xl bg-white text-[#333333] px-6 md:px-8 lg:px-12 py-3 md:py-4 lg:py-5 rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[#333333]/40">
            <h5 className="text-base md:text-lg font-semibold mb-0.5">Isabella White</h5>
            <hr className="h-[2px] w-full rounded-full border-none bg-black mb-1" />
            <div className="flex gap-0.5 mb-1">
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
              <FaStar size={18} color="#FF991C" />
            </div>
            <h4 className="text-xs md:text-sm font-medium mb-0.5">Exceptional dining experience!</h4>
            <p className="text-xs md:text-sm text-[#333333]/80">
              "I had an amazing dining experience at Hotgrill. The food was delicious, and the staff were incredibly attentive. Highly recommend!"
            </p>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex flex-col items-start justify-center space-y-6 md:space-y-8 lg:space-y-10">
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl ">
            Discover why Hotgrill is the talk of the town.
          </p>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl ">
            More than 250+ five-star reviews from our satisfied customers.
          </p>
          <Link to="/menu" className="inline-block px-6 py-3 rounded-2xl bg-[#FF991C]/70 text-black text-sm md:text-[15px] lg:text-base hover:bg-[#FF991C] transition-all duration-300">
            Order Now
          </Link>
        </div>
      </div>
    </section>
  );
}

export default RestaurantReviews;