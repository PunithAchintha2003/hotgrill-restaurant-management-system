import mongoose from "mongoose";

const issuedGiftCardSchema = new mongoose.Schema({
    code: { 
        type: String, 
        required: true, 
        unique: true 
    },
    originalOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    initialValue: { 
        type: Number, 
        required: true 
    },
    currentBalance: { 
        type: Number, 
        required: true 
    },
    status: {
        type: String,
        enum: ['active', 'redeemed', 'expired'],
        default: 'active'
    },
    redeemedHistory: [{
        amount: Number,
        date: { type: Date, default: Date.now },
        note: String
    }]
}, { timestamps: true });

export default mongoose.model("IssuedGiftCard", issuedGiftCardSchema);