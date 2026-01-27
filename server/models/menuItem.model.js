import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        imageUrl: { type: String, required: true },
        total: { type: Number, default: 0 },
        isAvailable: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model("MenuItem", menuItemSchema);