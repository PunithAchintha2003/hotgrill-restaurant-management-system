import React, { useState } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { GiForkKnifeSpoon } from "react-icons/gi";
import { NavLink, useNavigate } from "react-router-dom";
import AdminNotifications from './adminNotifications.jsx';

const AdminNav = () => {
    const navlinks = [
        { name: "Orders", path: "/admin/orders" },
        { name: "Products", path: "/admin/products" },
        { name: "Reservations", path: "/admin/reservations" },
        { name: "Users", path: "/admin/users" },
        { name: "Employees", path: "/admin/employees" },
        { name: "Messages", path: "/admin/messages" },
        { name: "Gifts", path: "/admin/giftcards" },
    ];

    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        window.dispatchEvent(new Event("auth-change"));
        navigate("/");
    };

    return (
        <nav className="bg-[#333333] border-b-8 border-[#333333]/30 shadow-[#333333]/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] group/nav overflow-x-hidden">
            <AdminNotifications />
             {/* Decorative Top Bar from Navigation.jsx */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
                <div className="h-[6px] bg-gradient-to-r from-transparent via-[#333333]/50 to-transparent shadow-[0_0_20px] shadow-[#333333]/30"/>
                <div className="flex justify-between px-6">
                    <GiForkKnifeSpoon className="text-[#FF991C]/40 -mt-4 -ml-2 rotate-45" size={32}/> 
                    <GiForkKnifeSpoon className="text-[#FF991C]/40 -mt-4 -ml-2 -rotate-45" size={32}/> 
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative">
                <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
                    
                    {/* Logo Section */}
                    <div className="flex-shrink-0 flex items-center space-x-2 ml-0 md:m-2">
                        <NavLink to="/admin/dashboard" className="text-2xl md:text-xl lg:text-4xl bg-gradient-to-r from-[#FF991C] to-[#FF991C] bg-clip-text text-transparent tracking-wider drop-shadow-[0_2px_2px] drop-shadow-black">
                            HotGrill <span className="text-white text-sm uppercase tracking-widest block md:inline md:ml-2">Admin</span>
                        </NavLink>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-2 md:space-x-4 flex-1 justify-end">
                        {navlinks.map((link) => (
                            <NavLink 
                                key={link.name} 
                                to={link.path} 
                                className={({isActive}) => `group px-3 md:px-3 lg:px-4 py-2 md:py-2 lg:py-3 text-sm md:text-[15px] lg:text-base relative transition-all duration-300 flex items-center rounded-3xl b-2 ${isActive ? 'border-[#333333]/50 bg-[#333333]/20 shadow-[inset_0_0_15px] shadow-[#333333]/20' : 'border-[#333333]/30 hover:border-[#333333]/50'} shadow-md shadow-[#333333]/20`}
                            >
                                <span className="text-white group-hover:text-[#FF991C] relative">
                                    {link.name}
                                    <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#FF991C] transition-all group-hover:w-full"/>
                                </span>
                            </NavLink>
                        ))}
                        
                        {/* Logout Button */}
                        <button onClick={handleLogout} className="ml-4 bg-red-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-white hover:text-red-500 transition-all text-sm md:text-base">
                            <FiLogOut /> Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center mr-2">
                        <button 
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white hover:text-white focus:outline-none transition-all p-2 rounded-xl border-2 border-[#333333]/30 hover:border-[#333333]/50 relative shadow-md shadow-[#333333] hover:shadow-lg hover:shadow-[#333333]/30"
                        >
                            <span className="text-xl">
                                {menuOpen ? <FiX /> : <FiMenu />}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-[#333333] border-t-4 border-[#333333]/40 relative shadow-lg shadow-[#333333]/30 w-full">
                    <div className="px-4 pt-4 pb-4 space-y-2">
                        {navlinks.map((link) => (
                            <NavLink 
                                key={link.name} 
                                to={link.path} 
                                onClick={() => setMenuOpen(false)}
                                className={({isActive}) => `block px-3 py-2 rounded-2xl b-2 w-full text-white text-center transition-all duration-300 ${isActive ? 'border-[#333333]/50 bg-[#333333]/20 shadow-[inset_0_0_15px] shadow-[#333333]/20' : 'border-[#333333]/30 hover:border-[#333333]/50'} shadow-md shadow-[#333333]/20`}
                            >
                                {link.name}
                            </NavLink>
                        ))}
                         <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="w-full bg-red-500 text-white py-3 rounded-xl mt-4">
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    )
};

export default AdminNav;