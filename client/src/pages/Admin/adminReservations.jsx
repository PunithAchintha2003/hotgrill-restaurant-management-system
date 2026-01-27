import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCalendarCheck, FaTrash, FaChair, FaSearch, FaExclamationTriangle, FaCog, FaCheck } from "react-icons/fa";

const AdminReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    
    const [totalTables, setTotalTables] = useState(10);
    const [showSettings, setShowSettings] = useState(false);

    const [editingRes, setEditingRes] = useState(null);
    const [editForm, setEditForm] = useState({ status: "", tableNumber: "" });

    const token = localStorage.getItem('token');
    const configHeaders = { headers: { 'Authorization': `Bearer ${token}` } };

    const fetchReservations = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/reservations/admin", configHeaders);
            setReservations(res.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reservations", error);
            setLoading(false);
        }
    };

    const fetchConfig = async () => {
        try {
            const res = await axios.get("http://localhost:4000/api/reservations/config/totalTables", configHeaders);
            if(res.data.value) setTotalTables(res.data.value);
        } catch (error) {
            console.error("Error fetching config", error);
        }
    }

    useEffect(() => {
        fetchReservations();
        fetchConfig();
    }, []);

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:4000/api/reservations/config", {
                key: "totalTables",
                value: totalTables
            }, configHeaders);
            setShowSettings(false);
            alert("Restaurant capacity updated!");
        } catch (error) {
            alert("Failed to update settings");
        }
    }

    const handleUpdateReservation = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:4000/api/reservations/admin/${editingRes._id}`, editForm, configHeaders);
            setEditingRes(null);
            fetchReservations();
        } catch (error) {
            alert("Failed to update reservation");
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm("Delete this reservation?")) return;
        try {
            await axios.delete(`http://localhost:4000/api/reservations/admin/${id}`, configHeaders);
            setReservations(reservations.filter(r => r._id !== id));
        } catch (error) {
            alert("Failed to delete");
        }
    };

    const openEdit = (res) => {
        setEditingRes(res);
        setEditForm({ status: res.status, tableNumber: res.tableNumber });
    };

    const filteredReservations = reservations.filter(res => {
        const matchesStatus = filter === "all" || res.status === filter;
        const matchesSearch = res.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              res.phone.includes(searchTerm);
        return matchesStatus && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-[#333333] py-8 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        Manage Reservations
                    </h1>
                    <button 
                        onClick={() => setShowSettings(true)}
                        className="bg-black/20 hover:bg-[#FF991C] hover:text-black text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
                    >
                        <FaCog /> Capacity Settings
                    </button>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
                    <div className="flex gap-2 flex-wrap">
                        {['all', 'pending', 'confirmed', 'cancelled', 'completed'].map(s => (
                            <button
                                key={s}
                                onClick={() => setFilter(s)}
                                className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider transition-colors ${
                                    filter === s ? 'bg-[#FF991C] text-black' : 'bg-black/20 text-gray-400 hover:bg-white/10'
                                }`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"/>
                        <input 
                            type="text" 
                            placeholder="Search..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-black/20 border border-gray-600 rounded-full pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#FF991C] w-full md:w-64"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-black/15 rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-black/20 text-gray-400 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Info</th>
                                    <th className="p-4">Date & Time</th>
                                    <th className="p-4">Guests</th>
                                    <th className="p-4">Table</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-400">Loading...</td></tr>
                                ) : filteredReservations.length === 0 ? (
                                    <tr><td colSpan="6" className="p-8 text-center text-gray-400">No reservations found.</td></tr>
                                ) : (
                                    filteredReservations.map(res => {
                                        const isConflict = res.tableNumber === "Conflict" || res.tableNumber === "Unassigned";
                                        
                                        return (
                                            <tr key={res._id} className={`hover:bg-white/5 transition-colors ${isConflict ? 'bg-red-500/10' : ''}`}>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{res.name}</div>
                                                    <div className="text-xs text-gray-500">{res.phone}</div>
                                                    {res.notes && <div className="text-xs text-[#FF991C] mt-1 italic max-w-xs">{res.notes}</div>}
                                                </td>
                                                <td className="p-4">
                                                    <div>{new Date(res.date).toLocaleDateString()}</div>
                                                    <div className="text-sm text-gray-400">{res.time}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="flex items-center gap-1">
                                                        <FaChair className="text-gray-500"/> {res.guests}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {isConflict ? (
                                                        <span className="flex items-center gap-1 text-red-400 font-bold text-sm bg-red-900/30 px-2 py-1 rounded">
                                                            <FaExclamationTriangle /> {res.tableNumber}
                                                        </span>
                                                    ) : (
                                                        <span className="font-mono text-[#FF991C] font-bold">{res.tableNumber}</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                                                        res.status === 'confirmed' ? 'bg-green-500/20 text-green-400' :
                                                        res.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                        res.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {res.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex justify-center gap-2">
                                                        <button onClick={() => openEdit(res)} className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-colors" title="Manage">
                                                            <FaChair />
                                                        </button>
                                                        <button onClick={() => handleDelete(res._id)} className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-colors" title="Delete">
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#262626] border border-[#FF991C]/30 rounded-2xl p-6 max-w-sm w-full">
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <FaCog className="text-[#FF991C]" /> Capacity Settings
                        </h3>
                        <form onSubmit={handleUpdateSettings}>
                            <div className="mb-6">
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Total Number of Tables</label>
                                <p className="text-xs text-gray-500 mb-2">Based on 4 seats per table capacity.</p>
                                <input 
                                    type="number" 
                                    value={totalTables} 
                                    onChange={e => setTotalTables(e.target.value)}
                                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[#FF991C]"
                                    min="1"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => setShowSettings(false)} className="flex-1 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 text-white">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-[#FF991C] rounded-xl hover:bg-[#e08918] text-white font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingRes && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#262626] border border-[#FF991C]/30 rounded-2xl p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-white mb-4">Manage Reservation</h3>
                        <p className="text-gray-400 mb-6 text-sm">For {editingRes.name} on {new Date(editingRes.date).toLocaleDateString()} at {editingRes.time}</p>
                        
                        <form onSubmit={handleUpdateReservation} className="space-y-4">
                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Status</label>
                                <select 
                                    value={editForm.status} 
                                    onChange={e => setEditForm({...editForm, status: e.target.value})}
                                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[#FF991C]"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs font-bold uppercase mb-2">Table Number(s)</label>
                                <input 
                                    type="text" 
                                    value={editForm.tableNumber} 
                                    onChange={e => setEditForm({...editForm, tableNumber: e.target.value})}
                                    placeholder="e.g. T1 or T1, T2"
                                    className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[#FF991C]"
                                />
                                <p className="text-xs text-gray-500 mt-1">Needed: {Math.ceil(editingRes.guests / 4)} tables ({editingRes.guests} guests)</p>
                            </div>
                            
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setEditingRes(null)} className="flex-1 py-3 bg-gray-700 rounded-xl hover:bg-gray-600 text-white">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-[#FF991C] rounded-xl hover:bg-[#e08918] text-white font-bold">Update</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReservations;