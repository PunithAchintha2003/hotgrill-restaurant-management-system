import React from "react";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import hotgrillInterior from '../assets/hotgrill_interior.png';
import staffImage from '../assets/hotgrill_staff.png';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#333333]">
      <Navigation />
      
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-[#333333] to-[#333333] py-16 px-4">
            <div className="max-w-7xl mx-auto text-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-white">
                    Our <span className="text-[#FF991C]">Story</span>
                </h1>
                <p className="text-white/80 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                    From a small backyard grill to "Flavor Town's" favorite spot.
                </p>
            </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-24">
                
                <div className="relative group rounded-3xl overflow-hidden shadow-2xl shadow-[#333333]/50 border-2 border-[#333333]/30 h-[400px]">
                    <div className="absolute inset-0 bg-[#333333]/20 group-hover:bg-transparent transition-all duration-500 z-10"/>
                    <img 
                        src={hotgrillInterior} 
                        alt="Restaurant Interior" 
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                    />
                </div>

                <div className="space-y-6 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Passion for the <span className="text-[#FF991C] border-b-4 border-[#FF991C]">Flame</span>
                    </h2>
                    <p className="text-white/80 text-lg leading-relaxed">
                        HotGrill began with a simple idea: that the best food brings people together. Located in the heart of Sri Lanka, we started as a humble stall with nothing but a charcoal grill and a family recipe for marinade.
                    </p>
                    <p className="text-white/80 text-lg leading-relaxed">
                        Today, we are proud to serve the community with authentic grilled dishes, fusing traditional spices with modern culinary techniques. We believe that every meal should be an experience—warm, welcoming, and exploding with flavor.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[#FF991C]/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF991C]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"/>
                    <h3 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4 flex items-center gap-3">
                        <span className="text-[#FF991C]">Our</span> Mission
                    </h3>
                    <p className="text-[#333333]/80 text-lg leading-relaxed">
                        To delight our customers with the freshest, high-quality grilled meals served with warmth and speed. We strive to create a dining atmosphere where every guest feels like family, ensuring that the "HotGrill" standard of taste and service is never compromised.
                    </p>
                </div>

                <div className="bg-[#333333] border border-[#FF991C]/30 p-8 md:p-10 rounded-3xl shadow-2xl transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[#FF991C]/20 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF991C]/10 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110"/>
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 flex items-center gap-3">
                        <span className="text-[#FF991C]">Our</span> Vision
                    </h3>
                    <p className="text-white/80 text-lg leading-relaxed">
                        To become the leading grilled food destination in Sri Lanka, recognized globally for our unique flavors, sustainable practices, and commitment to culinary innovation. We aim to redefine the fast-casual dining experience.
                    </p>
                </div>

            </div>

             <div className="mt-24 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
                    Meet The <span className="text-[#FF991C]">Team</span>
                </h2>
                <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-[#333333]/50">
                    <img 
                        src={staffImage} 
                        alt="Kitchen Team" 
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#333333] via-transparent to-transparent flex items-end justify-center pb-8">
                        <p className="text-white text-xl font-bold tracking-widest bg-[#333333]/80 px-6 py-2 rounded-full backdrop-blur-sm">
                            Masters of the Grill
                        </p>
                    </div>
                </div>
            </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

export default About;