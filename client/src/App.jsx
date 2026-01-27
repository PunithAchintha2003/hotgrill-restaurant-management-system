import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Homepage from "./pages/Homepage.jsx";
import Menu from "./pages/Menu.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Reviews from "./pages/Reviews.jsx";
import Cart from "./pages/Cart.jsx";
import Payment from "./pages/Payment.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import PaymentFailed from "./pages/PaymentFailed.jsx";
import Login from "./pages/auth/login.jsx"; 
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx"; 
import Signup from "./pages/auth/signup.jsx";
import ForgetPassword from "./pages/auth/forgetpassword.jsx";
import ResetPassword from "./pages/auth/resetpassword.jsx";
import AdminNav from "./components/admin/adminNav.jsx";
import AdminProducts from "./pages/Admin/adminProducts.jsx";
import AdminUsers from "./pages/Admin/adminUsers.jsx";
import AdminEmployees from "./pages/Admin/adminEmployees.jsx";
import AdminOrder from "./pages/Admin/adminOrder.jsx";
import AdminMessages from "./pages/Admin/adminMessages.jsx";
import TermsOfService from "./pages/serviceTerms.jsx";
import PrivacyPolicy from "./pages/privacyPolicy.jsx";
import Reservations from "./pages/Reservations.jsx";
import AdminReservations from "./pages/Admin/adminReservations.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import UserDashboard from "./pages/UserDashboard.jsx";
import GiftCards from "./pages/giftCards.jsx";
import AdminGiftCards from "./pages/Admin/adminGiftCards.jsx";
import AdminRedeem from "./pages/Admin/AdminRedeem.jsx";
import AdminReviews from "./pages/Admin/adminReviews.jsx";

const App = () => {
  return (
    <>
      <Toaster 
        position="top-center"
        containerStyle={{
          zIndex: 9999,
        }}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            padding: '16px 20px',
            fontSize: '15px',
            fontWeight: '500',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
          },
          success: {
            style: {
              background: '#1a1a1a',
              border: '2px solid #10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#1a1a1a',
              border: '2px solid #ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-failed" element={<PaymentFailed />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgetpassword" element={<ForgetPassword />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/policy" element={<PrivacyPolicy />} />
      <Route path="/reservations" element={<Reservations />} />
      <Route path="/gifts" element={<GiftCards />} />
      <Route 
        path="/admin/dashboard" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminDashboard />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/products" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminProducts />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/users" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminUsers />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/employees" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminEmployees />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/orders" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminOrder />
          </AdminRoute>
        } 
      /><Route 
          path="/admin/messages" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminMessages />
          </AdminRoute>
        } 
      /><Route 
        path="/admin/reservations" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminReservations />
          </AdminRoute>
        } 
      />
      <Route 
        path="/user/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/admin/giftcards" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminGiftCards />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/redeem" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminRedeem />
          </AdminRoute>
        } 
      />
      <Route 
        path="/admin/reviews" 
        element={
          <AdminRoute>
            <AdminNav />
            <AdminReviews />
          </AdminRoute>
        } 
      />
    </Routes>
    </>
  );
}

export default App;