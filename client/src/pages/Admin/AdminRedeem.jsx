import React, { useState } from 'react';
import axios from 'axios';
import { FaSearch, FaCheckCircle, FaMoneyBillWave, FaExclamationCircle } from 'react-icons/fa';

const AdminRedeem = () => {
    const [code, setCode] = useState('');
    const [cardData, setCardData] = useState(null);
    const [redeemAmount, setRedeemAmount] = useState('');
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('token');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    const handleValidate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });
        setCardData(null);

        try {
            const res = await axios.post('http://localhost:4000/api/giftcards/validate', { code }, config);
            if (res.data.success) {
                setCardData(res.data);
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Validation failed' });
        } finally {
            setLoading(false);
        }
    };

    const handleRedeem = async () => {
        if (!redeemAmount || redeemAmount <= 0) return;
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:4000/api/giftcards/redeem', {
                code: cardData.code,
                amount: redeemAmount
            }, config);

            if (res.data.success) {
                setMessage({ type: 'success', text: `Successfully redeemed LKR ${redeemAmount}` });
                setCardData(prev => ({ ...prev, balance: res.data.newBalance }));
                setRedeemAmount('');
            }
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Redemption failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#333333] py-12 px-4 text-white">
            <div className="max-w-xl mx-auto bg-black/20 border border-white/10 rounded-3xl p-8 shadow-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center text-[#FF991C]">Gift Card Terminal</h1>

                {/* Validation Section */}
                <form onSubmit={handleValidate} className="mb-8 relative">
                    <input 
                        type="text" 
                        value={code}
                        onChange={(e) => setCode(e.target.value.toUpperCase())}
                        placeholder="Enter Code (e.g. GC-A1B2...)"
                        className="w-full bg-[#262626] border border-gray-600 rounded-2xl py-4 pl-6 pr-14 text-xl tracking-widest text-white focus:border-[#FF991C] outline-none"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#FF991C] p-2 rounded-xl text-black hover:scale-105 transition">
                        <FaSearch />
                    </button>
                </form>

                {loading && <p className="text-center text-gray-400">Processing...</p>}

                {message.text && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                        {message.type === 'error' ? <FaExclamationCircle /> : <FaCheckCircle />}
                        {message.text}
                    </div>
                )}

                {/* Card Details & Redemption */}
                {cardData && (
                    <div className="bg-white/5 rounded-2xl p-6 border border-[#FF991C]/30 animation-fade-in">
                        <div className="text-center mb-6">
                            <p className="text-gray-400 text-sm uppercase tracking-wider">Current Balance</p>
                            <p className="text-5xl font-black text-white mt-2">LKR {cardData.balance}</p>
                            <p className="text-xs text-gray-500 mt-2">Initial Value: LKR {cardData.initial}</p>
                        </div>

                        <div className="flex gap-4">
                            <input 
                                type="number" 
                                value={redeemAmount}
                                onChange={(e) => setRedeemAmount(e.target.value)}
                                placeholder="Amount to deduct"
                                className="flex-1 bg-black/40 border border-gray-600 rounded-xl px-4 text-white outline-none"
                            />
                            <button 
                                onClick={handleRedeem}
                                disabled={cardData.balance <= 0}
                                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-3 px-6 rounded-xl flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
                            >
                                <FaMoneyBillWave /> Redeem
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminRedeem;