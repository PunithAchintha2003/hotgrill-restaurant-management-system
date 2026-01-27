import React from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, message, type = 'info', onConfirm, confirmText = 'Confirm', cancelText = 'Cancel', showCancel = false }) => {
    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <FiCheckCircle className="w-12 h-12 text-green-500" />;
            case 'error':
                return <FiAlertCircle className="w-12 h-12 text-red-500" />;
            case 'warning':
                return <FiAlertCircle className="w-12 h-12 text-yellow-500" />;
            default:
                return <FiInfo className="w-12 h-12 text-[#FF991C]" />;
        }
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#262626] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl animate-fadeIn">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition-colors"
                    >
                        <FiX className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <div className="flex flex-col items-center text-center gap-4">
                        {getIcon()}
                        <p className="text-white/90 text-base leading-relaxed">{message}</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-white/10 flex gap-3">
                    {showCancel && (
                        <button
                            onClick={onClose}
                            className="flex-1 bg-white/5 hover:bg-white/10 text-white font-medium py-3 px-6 rounded-xl transition-all"
                        >
                            {cancelText}
                        </button>
                    )}
                    <button
                        onClick={handleConfirm}
                        className={`flex-1 font-medium py-3 px-6 rounded-xl transition-all ${
                            type === 'error' || type === 'warning'
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-[#FF991C] hover:bg-[#FF991C]/90 text-white'
                        }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
