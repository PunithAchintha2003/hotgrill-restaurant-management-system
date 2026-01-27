import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

const FooterLinks = [
    { path: "Privacy Policy", link: "/policy" },
    { path: "Terms and Conditions", link: "/terms" },
    { path: "About", link: "/about" },
    { path: "Contact", link: "/contact" }
  ]

const Footer = () => {
    return (
        <footer className="bg-[#333333] text-white py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10">
                {/* <p>&copy; {new Date().getFullYear()} Hotgrill. All rights reserved.</p> */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* LEFT Column */}
                    <div className="space-y-6">
                        <h2 className="text-4xl sm:text-5xl md:text-5xl font-bold text-[#FF991C]">
                            HotGrill
                        </h2>
                        <p className="text-white text-sm">
                            Experience the best grilled meals in town with our signature recipes and premium ingredients. Join us for a culinary adventure that will tantalize your taste buds!
                        </p>
                    </div>
                    {/* MIDDLE Column */}
                    <div className="flex justify-center items-center">
                        <div className="space-y-4">
                            <ul className="space-y-3">
                                {FooterLinks.map((item) => (
                                    <li key={item.path}>
                                        <a href={item.link} className="flex items-center text-white hover:text-[#FF991C] transition-colors duration-300 group">
                                            {item.path}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    {/* RIGHT Column */}
                    <div className="flex justify-center md:justify-end">
                        <div className="space-y-4">
                            <div className="flex space-x-4 mb-6">
                                <a target="_blank" href="" className="text-2xl rounded-full hover:bg-[#FF991C] hover:scale-110 transition-all relative group" ><FaFacebookF /></a>
                                <a target="_blank" href="" className="text-2xl rounded-full hover:bg-[#FF991C] hover:scale-110 transition-all relative group" ><FaTwitter /></a>
                                <a target="_blank" href="" className="text-2xl rounded-full hover:bg-[#FF991C] hover:scale-110 transition-all relative group" ><FaInstagram /></a>
                                <a target="_blank" href="" className="text-2xl rounded-full hover:bg-[#FF991C] hover:scale-110 transition-all relative group" ><FaYoutube /></a>
                            </div>
                            <div className="address">
                                <p className="text-sm mb-4">123 Grill St, Flavor Town, Sri Lanka</p>
                                <p className="text-sm">Email: info@hotgrill.com</p>
                                <p className="text-sm">Phone: (123) 456-7890</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Copyright */}
                <div>
                    <p className="text-center text-sm text-white">&copy; {new Date().getFullYear()} Hotgrill. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;