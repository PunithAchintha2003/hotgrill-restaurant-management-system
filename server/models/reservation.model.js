import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        time: {
            type: String,
            required: true
        },
        guests: {
            type: Number,
            required: true,
            min: 1
        },
        tableNumber: {
            type: String,
            default: "Unassigned"
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "cancelled", "completed"],
            default: "pending"
        },
        notes: {
            type: String
        }
    },
    { timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);