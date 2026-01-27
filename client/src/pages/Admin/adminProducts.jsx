import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaSearch } from 'react-icons/fa';
import ProductForm from '../../components/admin/productForm';

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch Products
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/menu');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                // Get token from storage for admin middleware
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:4000/api/menu/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchProducts(); // Refresh list
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Failed to delete product');
            }
        }
    };

    // Handle Form Submit (Add or Update)
    const handleFormSubmit = async (formData) => {
        const token = localStorage.getItem('token');
        const config = {
            headers: { 
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${token}`
            }
        };

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('category', formData.category);
        data.append('isAvailable', formData.isAvailable);
        if (formData.image) {
            data.append('image', formData.image);
        }

        try {
            if (currentProduct) {
                // Update
                await axios.put(`http://localhost:4000/api/menu/${currentProduct._id}`, data, config);
            } else {
                // Create
                await axios.post('http://localhost:4000/api/menu', data, config);
            }
            setIsModalOpen(false);
            setCurrentProduct(null);
            fetchProducts();
        } catch (error) {
            console.error('Error saving product:', error);
            alert(error.response?.data?.message || 'Error saving product');
        }
    };

    const openAddModal = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    // Filter products based on search
    const filteredProducts = products.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#333333] via-[#333333] to-[#222222] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl text-white mb-2">Manage food and beverage offerings</h1>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="flex items-center gap-2 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-lg active:scale-95 border-1 border-white"
                    >
                        <FaPlus /> Add New Item
                    </button>
                </div>

                {/* Search Bar */}
                <div className="mb-8 relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input 
                        type="text" 
                        placeholder="Search items by name or category..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-full pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#FF991C] transition-colors"
                    />
                </div>

                {/* Content */}
                {loading ? (
                    <div className="text-center text-white py-12">Loading products...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((item) => (
                            <div key={item._id} className="bg-[#333333] rounded-2xl border border-white/5 overflow-hidden group hover:border-[#FF991C]/30 transition-all duration-300 shadow-xl">
                                <div className="h-48 relative overflow-hidden bg-black/20">
                                    <img 
                                        src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:4000${item.imageUrl}`} 
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    {!item.isAvailable && (
                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Unavailable</span>
                                        </div>
                                    )}
                                </div>
                                <div className="p-5">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-white line-clamp-1">{item.name}</h3>
                                        <span className="text-[#FF991C] font-bold">LKR {item.price}</span>
                                    </div>
                                    <p className="text-white/60 text-sm mb-4 line-clamp-2 h-10">{item.description}</p>
                                    <div className="flex gap-2 border-t border-white/10 pt-4">
                                        <button 
                                            onClick={() => openEditModal(item)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg transition-colors text-sm"
                                        >
                                            <FaEdit /> Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(item._id)}
                                            className="flex items-center justify-center px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reusable Modal Component */}
            <ProductForm 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={currentProduct}
            />
        </div>
    );
};

export default AdminProducts;