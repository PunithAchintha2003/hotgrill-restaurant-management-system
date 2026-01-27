import React from "react";
import { GiFruitBowl, GiHotMeal, GiChefToque } from "react-icons/gi";
import { MdEmojiPeople } from "react-icons/md";

const Features = () => {
  return (
    <section className="bg-gradient-to-b from-[#333333] to-[#333333] text-white py-12 md:py-16 lg:py-20 px-2 md:px-4 shadow-[0_25px_50px_-12px] shadow-[#333333]/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-clip-text text-white">
            Why Choose Hotgrill?
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-white/90">
            Discover the benefits of dining with us.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 lg:gap-10">
          <div className="flex flex-col items-center gap-3 bg-white text-[#333333] p-6 md:p-8 lg:p-10 rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[#333333]/40 min-w-[260px] md:min-w-[280px] lg:min-w-[320px]">
            <GiFruitBowl size={48} color="#FF991C" />
            <div className="flex flex-col items-center">
              <h3 className="text-lg md:text-xl lg:text-2xl pb-2">Fresh Ingredients</h3>
              <hr className="w-10 h-1 rounded-full border-none bg-[#FF991C]" />
            </div>
            <p className="text-center text-sm md:text-base lg:text-lg text-[#333333]/80">
              We use only the freshest ingredients to prepare our dishes, ensuring quality and taste in every bite.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 bg-white text-[#333333] p-6 md:p-8 lg:p-10 rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[#333333]/40 min-w-[260px] md:min-w-[280px] lg:min-w-[320px]">
            <GiHotMeal size={48} color="#FF991C" />
            <div className="flex flex-col items-center">
              <h3 className="text-lg md:text-xl lg:text-2xl pb-2">Hot Foods</h3>
              <hr className="w-10 h-1 rounded-full border-none bg-[#FF991C]" />
            </div>
            <p className="text-center text-sm md:text-base lg:text-lg text-[#333333]/80">
              Savor freshly prepared, steaming hot meals delivered straight to you.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 bg-white text-[#333333] p-6 md:p-8 lg:p-10 rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[#333333]/40 min-w-[260px] md:min-w-[280px] lg:min-w-[320px]">
            <MdEmojiPeople size={48} color="#FF991C" />
            <div className="flex flex-col items-center">
              <h3 className="text-lg md:text-xl lg:text-2xl pb-2">Best Service</h3>
              <hr className="w-10 h-1 rounded-full border-none bg-[#FF991C]" />
            </div>
            <p className="text-center text-sm md:text-base lg:text-lg text-[#333333]/80">
              We provide exceptional service to ensure your dining experience is memorable and satisfying.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 bg-white text-[#333333] p-6 md:p-8 lg:p-10 rounded-3xl shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[#333333]/40 min-w-[260px] md:min-w-[280px] lg:min-w-[320px]">
            <GiChefToque size={48} color="#FF991C" />
            <div className="flex flex-col items-center">
              <h3 className="text-lg md:text-xl lg:text-2xl pb-2">Expert Cooks</h3>
              <hr className="w-10 h-1 rounded-full border-none bg-[#FF991C]" />
            </div>
            <p className="text-center text-sm md:text-base lg:text-lg text-[#333333]/80">
              Our expert chefs prepare delicious meals with passion and skill.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;