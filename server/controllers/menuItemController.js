import menuItemModel from "../models/menuItem.model.js";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createMenuItem = async (req, res, next) => {
    try {
        const {name, description, price, category, isAvailable} = req.body;
        const imageUrl = req.file ? `/uploads/${req.file.filename}` : ``;
        const total = Number(price * 1);
        const newMenuItem = new menuItemModel({
            name,
            description,
            price,
            category,
            imageUrl,
            total,
            isAvailable
        });
        const savedItem = await newMenuItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "Menu item with this name already exists" });
            return;
        }
        res.status(500).json({ message: "Error creating menu item", error });
    }
};

export const getMenuItems = async (req, res, next) => {
    try {
        const menuItems = await menuItemModel.find().sort({ createdAt: -1 });
        const host = `${req.protocol}://${req.get("host")}`;
        const itemsWithFullImageUrl = menuItems.map(item => {
            const itemObj = item.toObject();
            return {
                ...itemObj,
                imageUrl: itemObj.imageUrl ? `${host}${itemObj.imageUrl}` : ''
            };
        });

        res.json(itemsWithFullImageUrl);
    } catch (error) {
        next(error);
    }
};

export const deleteMenuItem = async (req, res, next) => {
    try {
        const menuItem = await menuItemModel.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        if (menuItem.imageUrl) {
            // menuItem.imageUrl format is "/uploads/filename.ext"
            const filename = path.basename(menuItem.imageUrl);
            const filePath = path.join(__dirname, '../uploads', filename);

            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error("Error deleting file:", err);
                }
            });
        }
        await menuItemModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Menu item deleted successfully" });
    } catch (error) {
        next(error);
    }
};

export const getMenuItemById = async (req, res, next) => {
    try {
        const menuItem = await menuItemModel.findById(req.params.id);
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json(menuItem);
    } catch (error) {
        next(error);
    }
};

export const updateMenuItem = async (req, res, next) => {
    try {
        const menuItem = await menuItemModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!menuItem) {
            return res.status(404).json({ message: "Menu item not found" });
        }
        res.status(200).json(menuItem);
    } catch (error) {
        next(error);
    }
};