import React from "react";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import ReviewsDisplay from "../components/ReviewsDisplay.jsx";

const Reviews = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <ReviewsDisplay />
      <Footer />
    </div>
  );
}

export default Reviews;