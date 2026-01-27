import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../utils/CartContext';
import { FaPlus, FaMinus } from 'react-icons/fa';

const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Beverages', 'Snacks'];

const MenuDisplay = () => {

    const [active, setActive] = useState(categories[0]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const { cartItems, addToCart, updateQuantity } = useCart();

    const getQuantity = id => (cartItems.find(item => item.id === id)?.quantity || 0);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/menu');
                // Backend uses _id, frontend Cart uses id. Mapping for compatibility.
                const mappedData = response.data.map(item => ({
                    ...item,
                    id: item._id, // Map _id to id for existing cart logic
                    // Ensure Image URL is complete
                    image: item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:4000${item.imageUrl}`
                }));
                setMenuItems(mappedData);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch menu items", error);
                setLoading(false);
            }
        };
        fetchMenu();
    }, []);

    // Filter items based on active category
    const displayItems = menuItems.filter(item => item.category === active && item.isAvailable);

    return (
        <div className="bg-gradient-to-br from-[#333333] via-[#333333] to-[#333333] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font bold text-center mb-12 bg-clip-text text-white">
                    <span className='block text-xl sm:text-2xl md:text-3xl mt-4 text-white'>Explore Our Delicious Offerings</span>
                </h2>
                
                {/* Category Tabs */}
                <div className='flex flex-wrap justify-center gap-4 mb-16'>
                    {categories.map((category) => (
                        <button 
                            key={category} 
                            onClick={() => setActive(category)} 
                            className={`px-4 sm:px-6 py-2 text-white rounded-full border-1 transition-all duration-150 transform text-sm sm:text-lg tracking-widest backdrop-blur-sm ${active === category ? 'bg-[#FF991C] shadow-xl border-white' : 'hover:bg-[#FF991C]/70'}`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="text-center text-white text-xl">Loading menu...</div>
                ) : (
                    <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'>
                        {displayItems.map((item, i) => {
                            const quantity = getQuantity(item.id);
                            return (
                                <div key={item.id} className='relative bg-[#333333] rounded-2xl overflow-hidden border border-[#333333] backdrop-blur-sm flex flex-col transition-all duration-300' style={{ '--index': i }}>
                                    
                                    {/* Image Section */}
                                    <div className='relative h-80 sm:h-90 md:h-100 flex flex-col items-center justify-center bg-black/10'>
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className='max-h-full max-w-full object-contain transition-all duration-700' 
                                        />
                                        
                                        {/* Content Section */}
                                        <div className='p-4 sm:p-6 flex flex-col flex-grow w-full'>
                                            <div className='absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-[#FF991C] to-transparent opacity-50 transition-all duration-300' />
                                            
                                            <h3 className='text-xl sm:text-2xl mb-2 text-white transition-colors'>{item.name}</h3>
                                            <p className='text-white text-xs sm:text-sm mb-4 leading-relaxed'>{item.description}</p>
                                            
                                            <div className='mt-auto flex items-center gap-4 justify-between'>
                                                <div className='bg-[#333333]/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg'>
                                                    <span className='text-xl font-bold text-[#FF991C]'>LKR {item.price}</span>
                                                </div>
                                                
                                                <div className='flex items-center gap-2'>
                                                    {quantity > 0 ? (
                                                        <>
                                                            <button 
                                                                className='w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#333333]/50 transition-colors' 
                                                                onClick={() => updateQuantity(item.id, quantity - 1)}
                                                            >
                                                                <FaMinus className="text-white" />
                                                            </button>
                                                            <span className='w-8 text-center text-white'>{quantity}</span>
                                                            <button 
                                                                className='w-8 h-8 rounded-full bg-[#333333] flex items-center justify-center hover:bg-[#333333]/50 transition-colors' 
                                                                onClick={() => updateQuantity(item.id, quantity + 1)}
                                                            >
                                                                <FaPlus className="text-white" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button 
                                                            className='bg-[#333333] px-4 py-1.5 rounded-full text-xs uppercase sm:text-sm tracking-wider transition-transform duration-300 relative overflow-hidden border border-white min-w-31' 
                                                            // Keep this as addToCart because it's the initial add
                                                            onClick={() => addToCart(item, 1, 'MenuItem')}
                                                        >
                                                            <span className='relative z-10 text-xs text-white'>
                                                                Add to Cart
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}

                {!loading && displayItems.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-white text-lg">No items available in this category yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuDisplay;