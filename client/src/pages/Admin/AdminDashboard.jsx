import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { 
    FaMoneyBillWave, 
    FaUserTie, 
    FaBolt, 
    FaChartPie, 
    FaEnvelope, 
    FaTrash, 
    FaPlus,
    FaArrowRight,
    FaUserFriends,
    FaChair,
    FaCheck,
    FaStar,       // Added
    FaQuoteLeft   // Added
} from "react-icons/fa";

const AdminDashboard = () => {
    const [staffCost, setStaffCost] = useState(0);
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState([]);
    const [messages, setMessages] = useState([]);
    const [recentReviews, setRecentReviews] = useState([]); // NEW STATE FOR REVIEWS
    // NEW STATE FOR RESERVATION STATS
    const [resStats, setResStats] = useState({ expectedGuests: 0, tablesUtilized: 0, totalTables: 0, tablesFreeToday: 0 });
    
    const [loading, setLoading] = useState(true);
    
    const [newExpense, setNewExpense] = useState({
        category: 'Rent',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
    });

    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const fetchDashboardData = async () => {
        try {
            // 1. Get Employees
            const empRes = await axios.get("http://localhost:4000/api/employees", config);
            const totalPayroll = empRes.data.reduce((acc, emp) => acc + (emp.salary || 0) + (emp.bonus || 0), 0);
            setStaffCost(totalPayroll);

            // 2. Get Expenses
            const expRes = await axios.get("http://localhost:4000/api/expenses", config);
            setExpenses(expRes.data);

            // 3. Get Income
            const incomeRes = await axios.get("http://localhost:4000/api/payment/admin/income", config);
            setIncome(incomeRes.data.income);

            // 4. Get Messages
            const msgRes = await axios.get("http://localhost:4000/api/contact", config);
            setMessages(msgRes.data.slice(0, 3)); 

            // 5. GET DAILY RESERVATION STATS
            const resStatsData = await axios.get("http://localhost:4000/api/reservations/stats/daily", config);
            setResStats(resStatsData.data);

            // 6. GET RECENT REVIEWS (NEW)
            const reviewRes = await axios.get("http://localhost:4000/api/reviews/all");
            let reviewsData = [];
            // Handle specific data structure from previous error logs
            if (Array.isArray(reviewRes.data)) {
                reviewsData = reviewRes.data;
            } else if (reviewRes.data && Array.isArray(reviewRes.data.data)) {
                reviewsData = reviewRes.data.data;
            }
            setRecentReviews(reviewsData.slice(0, 3));

            setLoading(false);
        } catch (error) {
            console.error("Error fetching dashboard data", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);


    const handleExpenseSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:4000/api/expenses", newExpense, config);
            setExpenses([res.data, ...expenses]);
            setNewExpense({ ...newExpense, description: '', amount: '' });
        } catch (error) {
            console.error("Error adding expense", error);
        }
    };

    const deleteExpense = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/expenses/${id}`, config);
            setExpenses(expenses.filter(exp => exp._id !== id));
        } catch (error) {
            console.error("Error deleting expense", error);
        }
    };

    const totalOperationalCost = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const totalMonthlyOutflow = staffCost + totalOperationalCost;

    return (
        <div className="min-h-screen bg-[#333333] py-8 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-white pl-4">
                    Analytics Dashboard <span className="text-gray-400 text-lg font-normal ml-2">(Current Month)</span>
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF991C]"></div>
                    </div>
                ) : (
                    <>
                        {/* --- DAILY RESERVATION STATS --- */}
                        <div className="mb-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Expected People */}
                                <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 p-4 opacity-20">
                                        <FaUserFriends size={60} className="text-blue-400" />
                                    </div>
                                    <h3 className="text-blue-200 text-sm uppercase tracking-wider mb-2 font-semibold">Expected Guests</h3>
                                    <p className="text-4xl font-bold text-white">{resStats.expectedGuests}</p>
                                    <p className="text-xs text-blue-300 mt-2">Total covers for today</p>
                                </div>

                                {/* Tables Available (Unused Today) */}
                                <div className="bg-gradient-to-r from-green-900/40 to-green-800/40 border border-green-500/30 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 p-4 opacity-20">
                                        <FaChair size={60} className="text-green-400" />
                                    </div>
                                    <h3 className="text-green-200 text-sm uppercase tracking-wider mb-2 font-semibold">Tables Available</h3>
                                    <p className="text-4xl font-bold text-white">{resStats.tablesFreeToday}</p>
                                    <p className="text-xs text-green-300 mt-2">Unbooked tables (Total: {resStats.totalTables})</p>
                                </div>

                                {/* Tables Booked (Utilized) */}
                                <div className="bg-gradient-to-r from-orange-900/40 to-orange-800/40 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden">
                                    <div className="absolute right-0 top-0 p-4 opacity-20">
                                        <FaCheck size={60} className="text-orange-400" /> 
                                    </div>
                                    <h3 className="text-orange-200 text-sm uppercase tracking-wider mb-2 font-semibold">Tables Left</h3>
                                    <p className="text-4xl font-bold text-white">{resStats.tablesUtilized}</p>
                                    <p className="text-xs text-orange-300 mt-2">Tables with at least 1 booking</p>
                                </div>
                            </div>
                        </div>

                        {/* --- FINANCIAL STATS --- */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {/* Income Card */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF991C]/50 transition-all">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaMoneyBillWave size={80} />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Total Income</h3>
                                <p className="text-3xl font-bold text-green-400">LKR {income.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">From Completed Orders</p>
                            </div>

                            {/* Staff Cost */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF991C]/50 transition-all">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaUserTie size={80} />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Staff Payroll</h3>
                                <p className="text-3xl font-bold text-white">LKR {staffCost.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">Salaries + Bonuses</p>
                            </div>

                            {/* Ops Cost */}
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-[#FF991C]/50 transition-all">
                                <div className="absolute right-0 top-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaBolt size={80} />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Operational Costs</h3>
                                <p className="text-3xl font-bold text-[#FF991C]">LKR {totalOperationalCost.toLocaleString()}</p>
                                <p className="text-xs text-gray-500 mt-2">Rent, Utilities, Supplies</p>
                            </div>

                            {/* Total Outflow */}
                            <div className="bg-gradient-to-br from-[#FF991C]/20 to-transparent border border-[#FF991C]/30 rounded-2xl p-6 relative overflow-hidden">
                                <div className="absolute right-0 top-0 p-4 opacity-10">
                                    <FaChartPie size={80} />
                                </div>
                                <h3 className="text-[#FF991C] text-sm uppercase tracking-wider mb-2 font-bold">Total Outflow</h3>
                                <p className="text-3xl font-bold text-white">LKR {totalMonthlyOutflow.toLocaleString()}</p>
                                <p className="text-xs text-gray-300 mt-2">Total Monthly Liability</p>
                            </div>
                        </div>

                        {/* --- BOTTOM GRID --- */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            
                            {/* LEFT COLUMN: EXPENSES (Span 2) */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Add Expense Form */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                        <FaPlus className="text-[#FF991C]" size={16} /> Add Expense
                                    </h3>
                                    <form onSubmit={handleExpenseSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        <div className="md:col-span-1">
                                            <select 
                                                value={newExpense.category} 
                                                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                                                className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[#FF991C]"
                                            >
                                                <option value="Rent">Rent</option>
                                                <option value="Electricity">Electricity</option>
                                                <option value="Water">Water</option>
                                                <option value="Internet">Internet</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-1">
                                            <input 
                                                type="number" 
                                                placeholder="Amount" 
                                                value={newExpense.amount}
                                                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                                className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[#FF991C]"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-1">
                                            <input 
                                                type="text" 
                                                placeholder="Description (Optional)" 
                                                value={newExpense.description}
                                                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                                                className="w-full bg-black/20 border border-gray-600 rounded-lg p-3 text-white outline-none focus:border-[#FF991C]"
                                            />
                                        </div>
                                        <button type="submit" className="bg-[#FF991C] hover:bg-[#e08918] text-white font-bold rounded-lg transition-colors">
                                            Add
                                        </button>
                                    </form>
                                </div>

                                {/* Expense List Table */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                                    <h3 className="text-xl font-bold text-white mb-6">Recent Expenses</h3>
                                    {expenses.length === 0 ? (
                                        <p className="text-gray-400">No manual expenses recorded this month.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="text-gray-400 border-b border-gray-700">
                                                    <tr>
                                                        <th className="pb-3 pl-2">Category</th>
                                                        <th className="pb-3">Description</th>
                                                        <th className="pb-3">Date</th>
                                                        <th className="pb-3 text-right">Amount</th>
                                                        <th className="pb-3 text-center">Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="text-sm">
                                                    {expenses.map((exp) => (
                                                        <tr key={exp._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                            <td className="py-4 pl-2 font-medium text-[#FF991C]">{exp.category}</td>
                                                            <td className="py-4 text-gray-300">{exp.description}</td>
                                                            <td className="py-4 text-gray-400">{new Date(exp.date).toLocaleDateString()}</td>
                                                            <td className="py-4 text-right font-bold">LKR {exp.amount}</td>
                                                            <td className="py-4 text-center">
                                                                <button onClick={() => deleteExpense(exp._id)} className="text-red-400 hover:text-red-300 transition-colors">
                                                                    <FaTrash />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* RIGHT COLUMN: MESSAGES & REVIEWS (Span 1) */}
                            <div className="lg:col-span-1 flex flex-col gap-8">
                                
                                {/* 1. Inbox Widget */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-fit">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <FaEnvelope className="text-[#FF991C]" size={16} /> Inbox
                                        </h3>
                                        <Link to="/admin/messages" className="text-xs text-[#FF991C] hover:underline flex items-center gap-1">
                                            View All <FaArrowRight size={10} />
                                        </Link>
                                    </div>

                                    <div className="flex-grow space-y-4">
                                        {messages.length === 0 ? (
                                            <p className="text-gray-400">No new messages.</p>
                                        ) : (
                                            messages.map((msg) => (
                                                <div key={msg._id} className={`p-4 rounded-xl border ${msg.isRead ? 'border-gray-700 bg-black/20 opacity-60' : 'border-[#FF991C]/50 bg-black/40'}`}>
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-sm text-white truncate w-2/3">{msg.subject}</span>
                                                        <span className="text-[10px] text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 line-clamp-2">{msg.message}</p>
                                                    <div className="mt-2 text-[10px] text-[#FF991C]">From: {msg.name}</div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* 2. Reviews Widget (NEW) */}
                                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-fit">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            <FaStar className="text-[#FF991C]" size={16} /> Recent Reviews
                                        </h3>
                                        <Link to="/admin/reviews" className="text-xs text-[#FF991C] hover:underline flex items-center gap-1">
                                            View All <FaArrowRight size={10} />
                                        </Link>
                                    </div>

                                    <div className="flex-grow space-y-4">
                                        {recentReviews.length === 0 ? (
                                            <p className="text-gray-400">No reviews yet.</p>
                                        ) : (
                                            recentReviews.map((review) => (
                                                <div key={review._id} className="p-4 rounded-xl border border-white/10 bg-black/20">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-sm text-white truncate">{review.itemName}</span>
                                                        <div className="flex text-[#FF991C] text-[10px]">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} className={i < review.rating ? "" : "text-gray-600"} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="relative pl-3">
                                                        <FaQuoteLeft className="absolute top-0 left-0 text-white/10 text-[10px]" />
                                                        <p className="text-xs text-gray-400 line-clamp-2 italic">
                                                            {review.comment}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;