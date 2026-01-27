import React from "react";
import Navigation from "../components/Navigation.jsx";
import Hero from "../components/home/Hero.jsx";
import HotgrillSpecials from "../components/home/HotgrillSpecials.jsx";
import Features from "../components/home/Features.jsx";
import RestaurantReviews from "../components/home/RestaurantReviews.jsx";
import Footer from "../components/Footer.jsx";

const Homepage = () => {
  return (
      <>
        <Navigation />
        <Hero />
        <HotgrillSpecials />
        <RestaurantReviews />
        <Features />
        <Footer />
      </>
    );
}

export default Homepage;