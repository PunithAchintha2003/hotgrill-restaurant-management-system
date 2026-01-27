import React from "react";
import fishImg from "../../assets/devilled_fish.jpg";
import prawnsImg from "../../assets/devilled_prawns.jpg";
import kottuImg from "../../assets/kottu_roti.jpg";
import riceImg from "../../assets/vegetable_gurang_rice.jpg";

const HotgrillSpecials = () => {
    return (
        <div className="bg-gradient-to-b from-[#333333] to-[#333333] text-white py-16 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <h1 className="text-4xl font-bold mb-4 transform transition-all bg-clip-text">
                        Hotgrill Specials
                    </h1>
                </div>
                {/*------------------------------------------------Specials content-----------------------------------------------*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

                    <div className="relative group bg-[#333333] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-[#333333] border-2 border-transparent hover:border-[#333333] before:absolute before:inset-0 hover:before:opacity-20">
                        <div className="relative h-72 overflow-hidden">
                            <img src={fishImg} alt="Devilled Fish" className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"/>
                        </div>
                    </div>
                    <div className="relative group bg-[#333333] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-[#333333] border-2 border-transparent hover:border-[#333333] before:absolute before:inset-0 hover:before:opacity-20">
                        <div className="relative h-72 overflow-hidden">
                            <img src={prawnsImg} alt="Devilled Prawns" className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"/>
                        </div>
                    </div>
                    <div className="relative group bg-[#333333] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-[#333333] border-2 border-transparent hover:border-[#333333] before:absolute before:inset-0 hover:before:opacity-20">
                        <div className="relative h-72 overflow-hidden">
                            <img src={kottuImg} alt="Kottu Roti" className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"/>
                        </div>
                    </div>
                    <div className="relative group bg-[#333333] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-[#333333] border-2 border-transparent hover:border-[#333333] before:absolute before:inset-0 hover:before:opacity-20">
                        <div className="relative h-72 overflow-hidden">
                            <img src={riceImg} alt="Vegetable Gurang Rice" className="w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500"/>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    )
}

export default HotgrillSpecials;