import React from "react";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import CartItems from "../components/cartItems.jsx";

const Cart = () => {
    return (
        <>
            <Navigation />
            <CartItems />
            <Footer />
        </>
    );
}

export default Cart;