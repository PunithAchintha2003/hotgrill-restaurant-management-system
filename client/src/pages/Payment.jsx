import React from "react";
import Navigation from "../components/Navigation.jsx";
import Footer from "../components/Footer.jsx";
import PaymentForm from "../components/PaymentForm.jsx";

const Payment = () => {
    return (
        <>
            <Navigation />
            <PaymentForm />
            <Footer />
        </>
    );
}

export default Payment;