import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { GiForkKnifeSpoon } from "react-icons/gi"
import { FiShoppingCart, FiUser, FiLogOut, FiLayout } from "react-icons/fi"
import { useCart } from "../utils/CartContext.jsx";

const Navigation = () => {

  const [isOpen, setIsOpen] = useState(false);
  const Links = [
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/reservations" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Reviews", path: "/reviews" },
    { name: "Gifts", path: "/gifts" },
  ]
  const {totalItems} = useCart();

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(() => localStorage.getItem("role"));
  
  useEffect(() => {
    const syncAuth = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
      setUserRole(localStorage.getItem("role"));
    };
  
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-change", syncAuth);
  
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-change", syncAuth);
    };
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUserRole(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/");
  };

  // Determine dashboard path based on role
  const dashboardPath = userRole === 'admin' ? '/admin/dashboard' : '/user/dashboard';

  return (
    <nav className="bg-[#333333] border-b-8 border-[#333333]/30 shadow-[#333333]/30 sticky top-0 z-50 shadow-[0_25px_50px_-12px] group/nav overflow-x-hidden">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-full max-w-7xl px-4">
            <div className="h-[6px] bg-gradient-to-r from-transparent via-[#333333]/50 to-transparent shadow-[0_0_20px] shadow-[#333333]/30"/>
              <div className="flex justify-between px-6">
                <GiForkKnifeSpoon className="text-[#FF991C]/40 -mt-4 -ml-2 rotate-45" size={32}/> 
                <GiForkKnifeSpoon className="text-[#FF991C]/40 -mt-4 -ml-2 -rotate-45" size={32}/> 
              </div>
        </div>
{/* ------------------------------------------------NAVIGATION---------------------------------------------- */}
        <div className="max-w-7xl mx-auto px-4 relative">
            <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
              {/* ------------------------------------------------LOGO---------------------------------------------- */}
              <div className="flex-shrink-0 flex items-center space-x-2 group relative md:-translate-x-4 lg:-translate-x-6 ml-0 md:m-2">
                <div className="flex flew-col relative ml-2 max-w-[140px] md:max-w-[160px] lg:max-w-none">
                  <NavLink to="/" className="text-2xl md:text-xl lg:text-4xl bg-gradient-to-r from-[#FF991C] to-[#FF991C] bg-clip-text text-transparent tracking-wider drop-shadow-[0_2px_2px] drop-shadow-black -translate-x-2 truncate md:truncate-none">
                    HotGrill
                  </NavLink>
                </div>
              </div>
              {/* ------------------------------------------------Desktop Navigation---------------------------------------------- */}
              <div className="hidden md:flex items-center space-x-2 md:space-x-4 flex-1 justify-end ">
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.path} className={({isActive}) => ` group px-3 md:px-3 lg:px-4 py-2 md:py-2 lg:py-3 text-sm md:text-[15px] lg:text-base relative transition-all duration-300 flex items-center rounded-3xl b-2 ${isActive ? ' border-[#333333]/50  bg-[#333333]/20 shadow-[inset_0_0_15px] shadow-[#333333]/20' : 'border-[#333333]/30 hover:border-[#333333]/50' } shadow-md shadow-[#333333]/20 }`}>
                    <span className="text-white group-hover:text-[#FF991C] relative">
                      {link.name}
                      <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-[#FF991C] transition-all group-hover:w-full"/>
                    </span>
                  </NavLink>
                ))}
                <div className="flex items-center space-x-2 md:space-x-3 lg:space-x-4 ml-3 md:ml-3 lg:ml-6 mr-2 md:mr-3 lg:mr-4">
                  <NavLink to="/cart" className="text-white p-2 md:p-2.0 lg:p-3 rounded-xl transition-all relative border-2 border-[#333333]/30 hover:border-[#333333]/50 group hover:bg-[#333333]/20 hover:shadow-lg hover:shadow-[#333333]/30 shadow-md shadow-[#333333]/20">
                  <FiShoppingCart className="text-base md:text-lg lg:text-lg"/>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#333333] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
                  )}
                  </NavLink>
                  {/* AUTH BUTTONS SECTION */}
                  <div className="flex items-center">
                    {!isLoggedIn ? (
                      <NavLink to="/login" className="bg-[#FF991C] text-[#333333] px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-white transition-all">
                        <FiUser /> Login
                      </NavLink>
                    ) : (
                    <div className="flex items-center gap-3">
                      {/* Dashboard Button for ALL logged in users */}
                      <NavLink to={dashboardPath} className="bg-[#FF991C] text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-white hover:text-[#FF991C] transition-all">
                        <FiLayout /> Dashboard
                      </NavLink>
                      
                      <button onClick={handleLogout} className="bg-red-500 text-white px-6 py-2 rounded-xl flex items-center gap-2 cursor-pointer hover:bg-white hover:text-red-500 transition-all">
                        <FiLogOut /> Logout
                      </button>
                    </div>
                )}
                  </div>
                </div>
              </div>

              <div className="md:hidden flex items-center mr-2">
                <button className="text-white hover:text-white focus:outline-none transition-all p-2 rounded-xl border-2 border-[#333333]/30 hover:border-[#333333]/50 relative shadow-md shadow-[#333333] hover:shadow-lg hover:shadow-[#333333]/30" onClick={() => setIsOpen(!isOpen)}>
                  <div className="space-y-2 relative">
                    <span className={`block w-6 h-[2px] bg-current transition-all ${isOpen ? 'rotate-45 translate-y-[7px]' : '' }`}/>
                    <span className={`block w-6 h-[2px] bg-current transition-all ${isOpen ? 'opacity-0' : '' }`}/>
                    <span className={`block w-6 h-[2px] bg-current transition-all ${isOpen ? '-rotate-45 -translate-y-[7px]' : '' }`}/>
                  </div>
                </button>
              </div>
            </div>
        </div>

          {/* ------------------------------------------------Mobile Navigation---------------------------------------------- */}
          {isOpen && (
            <div className="md:hidden bg-[#333333] border-t-4 border-[#333333]/40 relative shadow:lg shadow-[#333333]/30 w-full">
              <div className="px-4 pt-4 space-y-2">
                {Links.map((link) => (
                  <NavLink key={link.name} to={link.path} onClick={() => setIsOpen(false)} className={({isActive}) => `block px-3 py-2 rounded-2xl b-2 w-full text-white text-center transition-all duration-300 ${isActive ? ' border-[#333333]/50  bg-[#333333]/20 shadow-[inset_0_0_15px] shadow-[#333333]/20' : 'border-[#333333]/30 hover:border-[#333333]/50' } shadow-md shadow-[#333333]/20 }`}>
                    {link.name}
                  </NavLink>
                ))}
                <div className="pt-4 border-t-2 border-[#333333] space-y-2">
                  <NavLink to="/cart" onClick={() => setIsOpen(false)} className="w-full px-4 py-3 text-center text-white rounded-xl border-2 border-[#333333]/30 flex items-center justify-center space-x-2 text-sm">
                  <FiShoppingCart className="text-lg"/>
                  {totalItems > 0 && (
                    <span className="top-2 -right-2 bg-[#333333] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>
                  )}
                  </NavLink>
                  {!isLoggedIn ? (
                    <NavLink to="/login" onClick={() => setIsOpen(false)} className="block w-full bg-[#FF991C] text-[#333333] font-bold py-3 rounded-xl text-center">
                      Login
                    </NavLink>
                  ) : (
                    <>
                      {/* Mobile Dashboard Button */}
                      <NavLink to={dashboardPath} onClick={() => setIsOpen(false)} className="block w-full bg-[#FF991C] text-white py-3 rounded-xl text-center">
                         Dashboard
                      </NavLink>
                      
                      <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full bg-red-500 text-white py-3 rounded-xl">
                        Logout
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
    </nav>
  );
}

export default Navigation;