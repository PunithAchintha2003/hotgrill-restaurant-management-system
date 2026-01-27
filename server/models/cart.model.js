import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: 'itemModel' 
    },
    itemModel: {
        type: String,
        required: true,
        enum: ['MenuItem', 'GiftCard'],
        default: 'MenuItem'
    },
    quantity : {
        type: Number,
        required: true,
        default: 1,
        min: 1
    }
}, {
    timestamps: true
})

export const CartModel = mongoose.model('CartItem', cartSchema);