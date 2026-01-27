import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import { FaPlus, FaEdit, FaTrash, FaGift, FaTimes, FaCloudUploadAlt } from 'react-icons/fa';

const AdminGiftCards = () => {
    const navigate = useNavigate();

    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentCard, setCurrentCard] = useState(null);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', isActive: true, image: null
    });
    const [preview, setPreview] = useState(null);

    const token = localStorage.getItem('token');
    const API_URL = 'http://localhost:4000/api/giftcards';

    const fetchCards = async () => {
        try {
            const res = await axios.get(API_URL);
            setCards(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching cards", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) data.append('image', formData[key]);
            else if (key !== 'image') data.append(key, formData[key]);
        });

        const config = {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
        };

        try {
            if (currentCard) {
                await axios.put(`${API_URL}/${currentCard._id}`, data, config);
            } else {
                await axios.post(API_URL, data, config);
            }
            closeModal();
            fetchCards();
        } catch (error) {
            alert("Operation failed");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this gift card?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchCards();
        } catch (error) {
            alert("Delete failed");
        }
    };

    const openModal = (card = null) => {
        if (card) {
            setCurrentCard(card);
            setFormData({
                name: card.name,
                description: card.description,
                price: card.price,
                isActive: card.isActive,
                image: null
            });
            setPreview(card.imageUrl);
        } else {
            setCurrentCard(null);
            setFormData({ name: '', description: '', price: '', isActive: true, image: null });
            setPreview(null);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    return (
        <div className="min-h-screen bg-[#333333] py-8 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-2xl text-white flex items-center gap-3">
                        Manage Gift Cards
                    </h1>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/admin/redeem')} 
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all"
                        >
                            <FaGift /> Redeem Card
                        </button>
                        <button 
                            onClick={() => openModal()} 
                            className="bg-[#FF991C] hover:bg-[#e08918] text-white px-6 py-2 rounded-full flex items-center gap-2 shadow-lg transition-all"
                        >
                            <FaPlus /> Add New Card
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map(card => (
                        <div key={card._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 relative group hover:border-[#FF991C]/50 transition-all">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                <button onClick={() => openModal(card)} className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white"><FaEdit /></button>
                                <button onClick={() => handleDelete(card._id)} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white"><FaTrash /></button>
                            </div>
                            <div className="h-40 mb-4 bg-black/20 rounded-xl overflow-hidden flex items-center justify-center">
                                <img src={card.imageUrl} alt={card.name} className="h-full object-contain" />
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{card.name}</h3>
                                    <p className="text-[#FF991C] font-bold">LKR {card.price}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${card.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {card.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Modal Form */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-[#333333] border border-[#FF991C]/30 w-full max-w-2xl rounded-2xl p-8 relative shadow-2xl">
                            <button onClick={closeModal} className="absolute top-4 right-4 text-white hover:text-[#FF991C]"><FaTimes size={24} /></button>
                            <h2 className="text-2xl font-bold text-white mb-6">{currentCard ? 'Edit Gift Card' : 'Add Gift Card'}</h2>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">Card Name</label>
                                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">Value (LKR)</label>
                                            <input type="number" name="price" value={formData.price} onChange={handleChange} required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="w-5 h-5 accent-[#FF991C]" />
                                            <label className="text-white">Available for purchase</label>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="relative border-2 border-dashed border-gray-600 rounded-lg h-32 flex items-center justify-center hover:border-[#FF991C] transition-colors">
                                            {preview ? <img src={preview} alt="Preview" className="h-full object-contain p-2" /> : <div className="text-center text-gray-400"><FaCloudUploadAlt size={24} className="mx-auto mb-1"/>Upload Image</div>}
                                            <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-400 mb-1 block">Description</label>
                                            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none resize-none" />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-[#FF991C] hover:bg-[#e08918] text-white font-bold py-3 rounded-full shadow-lg transition-all">{currentCard ? 'Update Card' : 'Create Card'}</button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminGiftCards;