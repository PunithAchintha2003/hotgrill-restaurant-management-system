import React, { useState, useEffect } from 'react';
import { FaTimes, FaUpload } from 'react-icons/fa';

const EmployeeForm = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: '', contact: '', email: '', dob: '', gender: 'Male',
        address: '', emergencyContact: '', salary: '', bonus: '0', isPaid: false
    });
    const [photoFile, setPhotoFile] = useState(null);
    const [preview, setPreview] = useState('');

    useEffect(() => {
        if (initialData) {
            const formattedDate = initialData.dob ? new Date(initialData.dob).toISOString().split('T')[0] : '';
            setFormData({ ...initialData, dob: formattedDate });
            setPreview(initialData.photo || '');
        } else {
            setFormData({
                name: '', contact: '', email: '', dob: '', gender: 'Male',
                address: '', emergencyContact: '', salary: '', bonus: '0', isPaid: false
            });
            setPreview('');
            setPhotoFile(null);
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPhotoFile(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        if (photoFile) data.append('photo', photoFile);
        
        onSubmit(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-[#333333] border border-[#FF991C]/30 w-full max-w-4xl rounded-2xl p-8 relative shadow-2xl">
                <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-[#FF991C]">
                    <FaTimes size={24} />
                </button>
                
                <h2 className="text-3xl font-bold text-white mb-8">
                    {initialData ? 'Edit Employee' : 'Add New Employee'}
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <input name="contact" value={formData.contact} onChange={handleChange} placeholder="Contact Number" required className="bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                            <input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Contact" required className="bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                        </div>

                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col">
                                <label className="text-gray-400 text-xs mb-1">Date of Birth</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                            </div>
                            <div className="flex flex-col">
                                <label className="text-gray-400 text-xs mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none">
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Residential Address" rows="3" required className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <input type="number" name="salary" value={formData.salary} onChange={handleChange} placeholder="Basic Salary (LKR)" required className="bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                            <input type="number" name="bonus" value={formData.bonus} onChange={handleChange} placeholder="Bonus (LKR)" className="bg-black/20 border border-gray-600 rounded-lg p-3 text-white focus:border-[#FF991C] outline-none" />
                        </div>

                        <div className="flex items-center gap-4 bg-black/20 p-3 rounded-lg border border-gray-600">
                            <label className="text-white cursor-pointer flex-grow">Salary Status</label>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" name="isPaid" checked={formData.isPaid} onChange={handleChange} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF991C]"></div>
                                <span className="ml-3 text-sm font-medium text-white">{formData.isPaid ? 'Paid' : 'Unpaid'}</span>
                            </label>
                        </div>

                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center text-center bg-black/20 hover:border-[#FF991C] transition-colors">
                            {preview ? (
                                <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full mb-4 border-2 border-[#FF991C]" />
                            ) : (
                                <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                    <FaUpload size={24} />
                                </div>
                            )}
                            <input type="file" onChange={handleFileChange} accept="image/*" className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FF991C] file:text-white hover:file:bg-[#e08918]" />
                        </div>

                        <div className="pt-4">
                             <button type="submit" className="w-full bg-[#FF991C] hover:bg-[#e08918] text-white font-bold py-3 rounded-full transition-all shadow-lg hover:shadow-[#FF991C]/40">
                                {initialData ? 'Update Employee Details' : 'Add Employee'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeForm;