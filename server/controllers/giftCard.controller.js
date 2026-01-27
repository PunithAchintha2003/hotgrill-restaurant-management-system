import GiftCard from "../models/giftCard.model.js";
import IssuedGiftCard from "../models/issuedGiftCard.model.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createGiftCard = async (req, res) => {
    try {
        const { name, description, price, isActive } = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

        const newCard = new GiftCard({
            name,
            description,
            price,
            imageUrl,
            isActive: isActive === 'true'
        });

        await newCard.save();
        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getGiftCards = async (req, res) => {
    try {
        const cards = await GiftCard.find().sort({ price: 1 });
        const host = `${req.protocol}://${req.get("host")}`;
        const cardsWithUrl = cards.map(card => {
            const cardObj = card.toObject();
            return {
                ...cardObj,
                imageUrl: cardObj.imageUrl ? `${host}${cardObj.imageUrl}` : ''
            };
        });
        res.json(cardsWithUrl);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateGiftCard = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.file) {
            updates.imageUrl = `/uploads/${req.file.filename}`;
        }
        if (updates.isActive) updates.isActive = updates.isActive === 'true';

        const updatedCard = await GiftCard.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!updatedCard) return res.status(404).json({ message: "Gift card not found" });
        
        res.json(updatedCard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteGiftCard = async (req, res) => {
    try {
        const card = await GiftCard.findById(req.params.id);
        if (!card) return res.status(404).json({ message: "Gift card not found" });
        if (card.imageUrl) {
            const filename = path.basename(card.imageUrl);
            const filePath = path.join(__dirname, '../uploads', filename);
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error("Error deleting gift card image:", err);
                }
            });
        }
        await GiftCard.findByIdAndDelete(req.params.id);
        res.json({ message: "Gift card deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const validateCard = async (req, res) => {
    try {
        const { code } = req.body;
        const card = await IssuedGiftCard.findOne({ code });

        if (!card) {
            return res.status(404).json({ success: false, message: "Invalid Gift Card Code" });
        }

        if (card.status !== 'active' || card.currentBalance <= 0) {
            return res.status(400).json({ success: false, message: "Card is empty or inactive", balance: 0 });
        }

        res.json({ 
            success: true, 
            code: card.code, 
            balance: card.currentBalance, 
            initial: card.initialValue 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const redeemCard = async (req, res) => {
    try {
        const { code, amount } = req.body;
        const deductAmount = parseFloat(amount);

        const card = await IssuedGiftCard.findOne({ code });

        if (!card) return res.status(404).json({ message: "Card not found" });
        if (card.currentBalance < deductAmount) {
            return res.status(400).json({ message: "Insufficient balance" });
        }

        card.currentBalance -= deductAmount;
        card.redeemedHistory.push({
            amount: deductAmount,
            note: "Redeemed via Admin Dashboard"
        });

        if (card.currentBalance === 0) {
            card.status = 'redeemed';
        }

        await card.save();

        res.json({ 
            success: true, 
            message: "Redemption Successful", 
            newBalance: card.currentBalance 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};