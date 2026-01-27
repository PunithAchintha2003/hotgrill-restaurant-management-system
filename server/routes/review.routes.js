import express from "express";
import { addReview, getAllReviews, deleteReview, updateReview } from "../controllers/review.controller.js";
import adminAuth from "../middleware/adminAuth.js";

const reviewRouter = express.Router();

// PUBLIC: Anyone can see and add reviews for now
reviewRouter.get("/all", getAllReviews); 
reviewRouter.post("/add", addReview); 

// TEMPORARY: Removed verifyToken to stop the crash
reviewRouter.delete("/:id", adminAuth, deleteReview); 
reviewRouter.put("/:id/read", adminAuth, updateReview);

export default reviewRouter;