import Review from "../models/review.model.js";

// Logic to SAVE a review to MongoDB Cloud
export const addReview = async (req, res) => {
  try {
    const { itemName, rating, comment } = req.body;
    const newReview = new Review({ itemName, rating, comment });
    await newReview.save();
    const io = req.app.get('socketio');
    io.emit("new_notification", {
        type: "review",
        message: `New ${rating}★ Review for ${itemName}`,
        link: "/admin/reviews" 
    });
    res.status(201).json({ success: true, message: "Review Saved Successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Logic to FETCH all reviews from MongoDB Cloud
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ date: -1 });
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE a review
export const deleteReview = async (req, res) => {
  try {
      await Review.findByIdAndDelete(req.params.id);
      res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
      res.status(500).json({ success: false, message: "Delete failed" });
  }
};

// UPDATE a review
export const updateReview = async (req, res) => {
  try {
      const updated = await Review.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
      res.status(200).json({ success: true, data: updated });
  } catch (error) {
      res.status(500).json({ success: false, message: "Update failed" });
  }
};