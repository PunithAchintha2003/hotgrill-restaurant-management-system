import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash, FaPhone, FaEnvelope } from 'react-icons/fa';
import EmployeeForm from '../../components/admin/employeeForm.jsx';

const AdminEmployees = () => {
    const [employees, setEmployees] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_URL = 'http://localhost:4000/api/employees';
    const token = localStorage.getItem('token');

    const getHeaders = () => ({
        headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });

    const fetchEmployees = async () => {
        try {
            const res = await axios.get(API_URL, { headers: { 'Authorization': `Bearer ${token}` } });
            setEmployees(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching employees", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleCreate = async (formData) => {
        try {
            await axios.post(API_URL, formData, { headers: { 'Authorization': `Bearer ${token}` } });
            setIsModalOpen(false);
            fetchEmployees();
        } catch (error) {
            console.error("Error creating employee", error);
            alert("Failed to create employee");
        }
    };

    const handleUpdate = async (formData) => {
        try {
            await axios.put(`${API_URL}/${currentEmployee._id}`, formData, { headers: { 'Authorization': `Bearer ${token}` } });
            setIsModalOpen(false);
            setCurrentEmployee(null);
            fetchEmployees();
        } catch (error) {
            console.error("Error updating employee", error);
            alert("Failed to update employee");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Are you sure you want to delete this employee?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, { headers: { 'Authorization': `Bearer ${token}` } });
            setEmployees(employees.filter(emp => emp._id !== id));
        } catch (error) {
            console.error("Error deleting employee", error);
        }
    };

    const openEditModal = (emp) => {
        setCurrentEmployee(emp);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setCurrentEmployee(null);
        setIsModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#333333] py-8 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <button 
                        onClick={openAddModal}
                        className="bg-[#FF991C] hover:bg-[#e08918] text-white px-6 py-2 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-[#FF991C]/40"
                    >
                        <FaPlus /> Add Employee
                    </button>
                </div>

                {loading ? (
                    <div className="text-center text-gray-400">Loading staff data...</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {employees.map((emp) => (
                            <div key={emp._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FF991C]/50 transition-all duration-300 relative group">
                                {/* Actions */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEditModal(emp)} className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white"><FaEdit /></button>
                                    <button onClick={() => handleDelete(emp._id)} className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white"><FaTrash /></button>
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <img 
                                        src={emp.photo || 'https://via.placeholder.com/150'} 
                                        alt={emp.name} 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-[#FF991C]" 
                                    />
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{emp.name}</h3>
                                        <p className="text-sm text-[#FF991C]">{emp.gender}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 text-sm text-gray-300 mb-6">
                                    <div className="flex items-center gap-2">
                                        <FaPhone className="text-[#FF991C]" size={12} /> {emp.contact}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaEnvelope className="text-[#FF991C]" size={12} /> {emp.email}
                                    </div>
                                    <p><span className="text-gray-500">Address:</span> {emp.address}</p>
                                    <p><span className="text-gray-500">Emergency:</span> {emp.emergencyContact}</p>
                                </div>

                                <div className="border-t border-white/10 pt-4 mt-auto">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Salary</span>
                                        <span className="font-bold">LKR {emp.salary}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-gray-400">Bonus</span>
                                        <span className="font-bold text-green-400">+ LKR {emp.bonus}</span>
                                    </div>
                                    <div className={`mt-3 text-center py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                                        emp.isPaid ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                        {emp.isPaid ? 'Salary Paid' : 'Payment Pending'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <EmployeeForm 
                    isOpen={isModalOpen} 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={currentEmployee ? handleUpdate : handleCreate}
                    initialData={currentEmployee}
                />
            </div>
        </div>
    );
};

export default AdminEmployees;