import React, { useState, useEffect } from 'react';
import { FaTimes, FaCloudUploadAlt } from 'react-icons/fa';

const ProductForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Breakfast',
        isAvailable: true,
        image: null
    });
    const [preview, setPreview] = useState(null);

    // Categories matching your dummy data structure
    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Beverages', 'Snacks'];

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                description: initialData.description,
                price: initialData.price,
                category: initialData.category,
                isAvailable: initialData.isAvailable,
                image: null // Reset file input on edit load
            });
            // Handle image preview for existing items
            setPreview(initialData.imageUrl.startsWith('http') 
                ? initialData.imageUrl 
                : `http://localhost:4000${initialData.imageUrl}`);
        } else {
            // Reset for Add mode
            setFormData({
                name: '',
                description: '',
                price: '',
                category: 'Breakfast',
                isAvailable: true,
                image: null
            });
            setPreview(null);
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-[#333333] border border-white/10 w-full max-w-2xl rounded-2xl shadow-2xl relative animate-fade-in-up">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                >
                    <FaTimes size={24} />
                </button>
                
                <h2 className="text-2xl font-bold text-white p-6 border-b border-white/10">
                    {initialData ? 'Edit Product' : 'Add New Product'}
                </h2>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Product Name</label>
                            <input 
                                type="text" 
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                placeholder="e.g. Classic Pancakes"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white/80">Price (LKR)</label>
                            <input 
                                type="number" 
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Category</label>
                        <select 
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-[#333333]">{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="3"
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors resize-none"
                            placeholder="Product details..."
                        />
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/80">Product Image</label>
                        <div className="relative border-2 border-dashed border-white/20 rounded-xl p-4 hover:border-[#FF991C]/50 transition-colors text-center">
                            <input 
                                type="file" 
                                onChange={handleImageChange}
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {preview ? (
                                <img src={preview} alt="Preview" className="h-32 mx-auto object-contain rounded-lg" />
                            ) : (
                                <div className="py-8 flex flex-col items-center text-white/40">
                                    <FaCloudUploadAlt size={32} className="mb-2" />
                                    <span>Click to upload image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Availability Toggle */}
                    <div className="flex items-center gap-3">
                        <input 
                            type="checkbox"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            id="isAvailable"
                            className="w-5 h-5 rounded border-white/20 bg-black/20 text-[#FF991C] focus:ring-[#FF991C]"
                        />
                        <label htmlFor="isAvailable" className="text-white cursor-pointer select-none">
                            Available for order
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 py-3 rounded-full bg-[#FF991C] text-white font-bold hover:bg-[#FF991C]/90 shadow-lg shadow-[#FF991C]/20 transition-all transform active:scale-95"
                        >
                            {initialData ? 'Update Product' : 'Add Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductForm;