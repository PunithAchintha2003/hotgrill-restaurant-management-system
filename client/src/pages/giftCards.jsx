import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../utils/CartContext';
import { FaGift, FaShoppingCart, FaCheck } from 'react-icons/fa'; 
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const GiftCards = () => {
    const [giftCards, setGiftCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addedCardId, setAddedCardId] = useState(null); 
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('http://localhost:4000/api/giftcards');
                setGiftCards(response.data.filter(card => card.isActive));
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch gift cards", error);
                setLoading(false);
            }
        };
        fetchCards();
    }, []);

    const handleAddToCart = (card) => {
        const cartItem = {
            id: card._id,
            name: card.name,
            price: card.price,
            imageUrl: card.imageUrl,
            description: card.description
        };
        
        addToCart(cartItem, 1, 'GiftCard');
        setAddedCardId(card._id);
        setTimeout(() => {
            setAddedCardId(null);
        }, 1500);
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#333333]">
            <Navigation />
            <div className="bg-gradient-to-b from-[#333333] to-[#333333] py-16 px-4 sm:px-6 lg:px-8 flex-grow">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
                            Give the Gift of <span className="text-[#FF991C]">Flavor</span>
                        </h1>
                        <p className="text-white text-lg">
                            Perfect for birthdays, holidays, or just because.
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center text-white text-xl">Loading gift cards...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {giftCards.map((card) => {
                                const isAdded = addedCardId === card._id;

                                return (
                                    <div key={card._id} className="group bg-[#262626] rounded-3xl overflow-hidden border border-white/10 hover:border-[#FF991C]/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#FF991C]/10">
                                        <div className="relative h-56 overflow-hidden bg-black/20 p-4 flex items-center justify-center">
                                            <img 
                                                src={card.imageUrl} 
                                                alt={card.name} 
                                                className="h-full object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-bold text-white">{card.name}</h3>
                                                <div className="bg-[#FF991C]/20 px-3 py-1 rounded-full">
                                                    <span className="text-[#FF991C] font-bold">LKR {card.price}</span>
                                                </div>
                                            </div>
                                            <p className="text-gray-400 text-sm mb-6 h-10 line-clamp-2">{card.description}</p>
                                            
                                            <button 
                                                onClick={() => handleAddToCart(card)}
                                                disabled={isAdded}
                                                className={`w-full font-black py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95
                                                    ${isAdded 
                                                        ? 'bg-green-500 text-white cursor-default' // Success Style
                                                        : 'bg-gradient-to-r from-[#FF991C] to-[#E9D967] text-black hover:brightness-110' // Default Style
                                                    }
                                                `}
                                            >
                                                {isAdded ? (
                                                    <>
                                                        <FaCheck /> Added to Cart!
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaShoppingCart /> Add to Cart
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default GiftCards;