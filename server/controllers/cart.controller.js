import asyncHandler from 'express-async-handler';
import { CartModel } from '../models/cart.model.js';
import mongoose from 'mongoose';

import '../models/menuItem.model.js';
import '../models/giftCard.model.js';

export const getCart = asyncHandler(async (req, res) => {
    const cartItems = await CartModel.find({ user: req.user.id }).populate('item');
    const formatted = cartItems.map(ci => ({
        _id: ci._id.toString(),
        item: ci.item,
        quantity: ci.quantity,
        itemType: ci.itemModel
    }))
    res.json(formatted);
})

export const addToCart = asyncHandler(async (req, res) => {
    const { itemId, quantity, itemType = 'MenuItem' } = req.body;

    if (!itemId || typeof quantity !== 'number') {
        res.status(400);
        throw new Error('ID and quantity are required');
    }

    if (!mongoose.Types.ObjectId.isValid(itemId)) {
        res.status(400);
        throw new Error('Invalid Item ID format');
    }

    // Check if item exists in cart (matching ID AND Type)
    let cartItem = await CartModel.findOne({ 
        user: req.user.id, 
        item: itemId,
        itemModel: itemType 
    });

    if (cartItem) {
        cartItem = await CartModel.findOneAndUpdate(
            { _id: cartItem._id },
            { $inc: { quantity: quantity } },
            { new: true }
        ).populate('item');
    } else {
        cartItem = await CartModel.create({
            user: req.user.id,
            item: itemId,
            quantity,
            itemModel: itemType
        });
        await cartItem.populate('item');
    }

    if (cartItem.quantity < 1) {
        await CartModel.findByIdAndDelete(cartItem._id);
        return res.json({ _id: cartItem._id.toString(), item: cartItem.item, quantity: 0, deleted: true });
    }

    res.status(200).json({ 
        _id: cartItem._id.toString(), 
        item: cartItem.item, 
        quantity: cartItem.quantity,
        itemType: cartItem.itemModel
    });
});

export const updateCartItem = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid Cart Item ID');
    }

    const cartItem = await CartModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        { $set: { quantity: Math.max(1, quantity) } },
        { new: true }
    ).populate('item');
    
    if (!cartItem) {
        res.status(404);
        throw new Error('Cart item not found');
    }
    
    res.json({ _id: cartItem._id.toString(), item: cartItem.item, quantity: cartItem.quantity });
})

export const removeCartItem = asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        res.status(400);
        throw new Error('Invalid Cart Item ID');
    }

    const cartItem = await CartModel.findOneAndDelete({ 
        _id: req.params.id, 
        user: req.user.id 
    });
    
    if (!cartItem) {
        res.status(404);
        throw new Error('Cart item not found');
    }
    
    res.json({ _id: req.params.id });
})

export const clearCart = asyncHandler(async (req, res) => {
    await CartModel.deleteMany({ user: req.user.id });
    res.json({ message: 'Cart cleared' });
})