import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  date: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);
export default Review;