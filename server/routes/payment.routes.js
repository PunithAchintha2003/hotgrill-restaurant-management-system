import express from 'express';
import {
    createPaymentIntent,
    confirmPayment,
    getOrder,
    getUserOrders,
    getAllOrders,
    updateOrderStatus,
    getMonthlyIncome,
    acceptOrder,
    cancelOrderAdmin,
    cancelOrderUser,
    deleteOrder
} from '../controllers/payment.controller.js';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// User routes (require authentication)
router.post('/create-payment-intent', auth, createPaymentIntent);
router.post('/confirm-payment', auth, confirmPayment);
router.get('/order/:orderId', auth, getOrder);
router.get('/my-orders', auth, getUserOrders);
router.put('/order/:orderId/cancel', auth, cancelOrderUser);
router.delete('/order/:orderId', auth, deleteOrder);

// Admin routes
router.get('/admin/orders', adminAuth, getAllOrders);
router.put('/admin/orders/:orderId/status', adminAuth, updateOrderStatus);
router.put('/admin/orders/:orderId/accept', adminAuth, acceptOrder);
router.put('/admin/orders/:orderId/cancel', adminAuth, cancelOrderAdmin);
router.get('/admin/income', adminAuth, getMonthlyIncome);

export default router;