import React from "react";
import { Link } from "react-router-dom";
import heroImage from "../../assets/hero.png";
import { MdDeliveryDining } from "react-icons/md";
import { GiMeal, GiChefToque } from "react-icons/gi";
import { FaAward, FaSmileBeam } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-[#333333] to-[#333333] text-white py-8 md:py-15 px-2 md:px-4 shadow-[0_25px_50px_-12px] shadow-[#333333]/30">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="flex flex-col items-start justify-center space-y-6 md:space-y-8 lg:space-y-10">
          <h1 className="text-3xl md:text-4xl lg:text-5xl bg-clip-text text-white">
            Welcome to Hotgrill
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-white/90 max-w-xl ">
            Experience a curated menu of seasonal flavors, crafted with passion and served with elegance
          </p>
          <Link to="/menu" className="inline-block px-6 py-3 rounded-2xl bg-[#FF991C]/70 text-black text-sm md:text-[15px] lg:text-base hover:bg-[#FF991C] transition-all duration-300">
            Explore Menu
          </Link>
        </div>
        {/* Right Side */}
        <div className="relative flex justify-center items-center min-h-[340px] md:min-h-[420px] lg:min-h-[500px]">
          <img src={heroImage} alt="Hero" className="w-64 md:w-80 lg:w-[380px] h-auto rounded-3xl shadow-2xl object-cover z-10"
          />
          {/* Banners */}
          {/* Fast Delivery */}
          <div className="hidden sm:flex absolute top-4 right-2 md:right-8 max-w-48 bg-white shadow-md pl-3 py-2 rounded-xl items-center gap-2">
            <MdDeliveryDining size={36} color="#FF991C" />
            <div>
              <h5 className="font-semibold text-[#333333] text-sm">Fast Delivery</h5>
              <p className="text-xs text-[#333333]/80">Get your food delivered quickly and efficiently</p>
            </div>
          </div>
          {/* 50+ Dishes */}
          <div className="hidden sm:flex absolute top-32 right-0 md:right-4 max-w-52 bg-white shadow-md p-2 rounded-xl items-center gap-2">
            <GiMeal size={28} color="#FF991C" />
            <h5 className="font-semibold text-[#333333] text-sm">50+ Dishes</h5>
          </div>
          {/* 10+ Branches */}
          <div className="hidden sm:flex absolute bottom-8 right-4 max-w-48 bg-white shadow-md pl-3 py-2 rounded-xl items-center gap-2">
            <FaAward size={26} color="#FF991C" />
            <div>
              <h5 className="font-semibold text-[#333333] text-sm">Award Winning</h5>
              <p className="text-xs text-[#333333]/80">Recognized for excellence in taste and service</p>
            </div>
          </div>
          {/* Happy Customers */}
          <div className="hidden sm:flex absolute top-10 left-0 md:-left-8 max-w-48 bg-white shadow-md pl-3 py-2 rounded-xl items-center gap-2">
            <FaSmileBeam size={26} color="#FF991C" />
            <div>
              <h5 className="font-semibold text-[#333333] text-sm">Happy Customers</h5>
              <p className="text-xs text-[#333333]/80">Serving smiles with every serving</p>
            </div>
          </div>
          {/* Expert Cooks */}
          <div className="hidden sm:flex absolute bottom-8 left-0 md:-left-8 max-w-48 bg-white shadow-md p-2 rounded-xl items-center gap-2">
            <GiChefToque size={22} color="#FF991C" />
            <h5 className="font-semibold text-[#333333] text-sm">Expert Cooks</h5>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;