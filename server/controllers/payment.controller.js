import Stripe from 'stripe';
import Order from '../models/order.model.js';
import asyncHandler from 'express-async-handler';
import nodemailer from 'nodemailer';
import IssuedGiftCard from '../models/issuedGiftCard.model.js';
import GiftCard from '../models/giftCard.model.js';
import crypto from 'crypto';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Initialize email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const generateGiftCode = () => {
    return 'GC-' + crypto.randomBytes(3).toString('hex').toUpperCase() + '-' + crypto.randomBytes(3).toString('hex').toUpperCase();
};

const sendGiftCardEmail = async (customer, cards) => {
    const cardsHtml = cards.map(c => `
        <div style="border: 2px dashed #FF991C; padding: 20px; margin: 10px 0; border-radius: 10px; background: #fff5e6;">
            <h3 style="margin: 0; color: #333;">${c.name}</h3>
            <p style="font-size: 24px; font-weight: bold; color: #FF991C; letter-spacing: 2px; margin: 10px 0;">${c.code}</p>
            <p style="margin: 0; color: #666;">Value: LKR ${c.amount.toFixed(2)}</p>
        </div>
    `).join('');

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: customer.email,
        subject: 'Your Gift Cards are here!',
        html: `
            <h1>Here are your Gift Cards!</h1>
            <p>Hi ${customer.name}, thanks for your purchase.</p>
            ${cardsHtml}
            <p>Present these codes at the restaurant to redeem.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (order) => {
    try {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Build order items HTML
        const orderItemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong><br>
                    <span style="color: #666; font-size: 12px;">Quantity: ${item.quantity}</span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    LKR ${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        // Build address HTML if available
        const addressHtml = order.customerDetails.address && 
            (order.customerDetails.address.street || order.customerDetails.address.city) 
            ? `
                <p style="margin: 5px 0;">
                    ${order.customerDetails.address.street || ''}<br>
                    ${order.customerDetails.address.city || ''} ${order.customerDetails.address.postalCode || ''}<br>
                    ${order.customerDetails.address.country || 'Sri Lanka'}
                </p>
            ` : '<p style="margin: 5px 0; color: #666;">No address provided</p>';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #FF991C 0%, #e08918 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    table { width: 100%; border-collapse: collapse; }
                    .total { font-size: 18px; font-weight: bold; color: #FF991C; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Order Confirmation</h1>
                        <p>Thank you for your order!</p>
                    </div>
                    <div class="content">
                        <p>Dear ${order.customerDetails.name},</p>
                        <p>Your order has been confirmed and payment has been processed successfully.</p>
                        
                        <div class="order-details">
                            <h2 style="color: #FF991C; margin-top: 0;">Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${orderDate}</p>
                            <p><strong>Payment Status:</strong> <span style="color: green;">Completed</span></p>
                            
                            <h3 style="margin-top: 20px;">Order Items:</h3>
                            <table>
                                ${orderItemsHtml}
                                <tr>
                                    <td style="padding: 15px 10px; border-top: 2px solid #FF991C; font-weight: bold;">
                                        Total Amount
                                    </td>
                                    <td style="padding: 15px 10px; border-top: 2px solid #FF991C; text-align: right;" class="total">
                                        LKR ${order.totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            </table>
                            
                            <h3 style="margin-top: 20px;">Delivery Information:</h3>
                            <p><strong>Name:</strong> ${order.customerDetails.name}</p>
                            <p><strong>Email:</strong> ${order.customerDetails.email}</p>
                            <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
                            <p><strong>Address:</strong></p>
                            ${addressHtml}
                        </div>
                        
                        <div style="background: #fff3e0; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="margin-top: 0; color: #FF991C;">What's Next?</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Our kitchen team will start preparing your delicious meal</li>
                                <li>We'll notify you when your order is ready for pickup/delivery</li>
                                <li>You can track your order status in your account</li>
                            </ul>
                        </div>
                        
                        <p>If you have any questions, please don't hesitate to contact us.</p>
                        <p>Thank you for choosing HotGrill!</p>
                        
                        <div class="footer">
                            <p>HotGrill Restaurant<br>
                            Email: info@hotgrill.com</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.customerDetails.email,
            subject: `Order Confirmation - HotGrill (Order #${order._id.toString().slice(-8)})`,
            html: htmlContent,
            text: `
                Order Confirmation - HotGrill
            
                Dear ${order.customerDetails.name},
                
                Your order has been confirmed and payment has been processed successfully.
                
                Order ID: ${order._id}
                Order Date: ${orderDate}
                Payment Status: Completed
                
                Order Items:
                ${order.items.map(item => `- ${item.name} x${item.quantity} - LKR ${(item.price * item.quantity).toFixed(2)}`).join('\n')}
                
                Total Amount: LKR ${order.totalAmount.toFixed(2)}
                
                Delivery Information:
                Name: ${order.customerDetails.name}
                Email: ${order.customerDetails.email}
                Phone: ${order.customerDetails.phone}
                
                What's Next?
                - Our kitchen team will start preparing your delicious meal
                - We'll notify you when your order is ready for pickup/delivery
                
                Thank you for choosing HotGrill!
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('Order confirmation email sent successfully to:', order.customerDetails.email);
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        // Don't throw error - email failure shouldn't break payment confirmation
    }
};

// Create payment intent
export const createPaymentIntent = asyncHandler(async (req, res) => {
    try {
        const { amount, currency = 'usd', items, customerDetails } = req.body;
        const userId = req.user.id;

        // Debug logging
        console.log('Payment Intent Request:', {
            amount,
            currency,
            itemsCount: items?.length,
            customerDetails,
            userId
        });

        // Validate required fields
        if (!amount || !items || !customerDetails) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: amount, items, or customerDetails'
            });
        }

        // Validate customer details
        if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
            return res.status(400).json({
                success: false,
                message: 'Customer name, email, and phone are required'
            });
        }

        // Validate items
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'At least one item is required'
            });
        }

        // Validate minimum order amount (150 LKR ≈ 0.50 USD)
        if (currency.toLowerCase() === 'lkr' && amount < 150) {
            return res.status(400).json({
                success: false,
                message: 'Minimum order amount is LKR 150.00'
            });
        }

        // Convert LKR to USD (approximate rate: 1 USD = 300 LKR)
        const usdAmount = currency.toLowerCase() === 'lkr' ? amount / 300 : amount;
        
        // Ensure minimum amount (50 cents)
        const finalAmount = Math.max(usdAmount, 0.50);
        
        // Create payment intent with Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(finalAmount * 100), // Convert to cents
            currency: 'usd',
            metadata: {
                userId: userId,
                itemCount: items.length.toString(),
                originalAmount: amount.toString(),
                originalCurrency: currency
            }
        });

        // Map cart items to order items format
        const orderItems = items.map(item => ({
            menuItemId: item.id || item._id, // Use id (which is mapped from _id) or fallback to _id
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
        }));

        // Create order in database with pending status
        const order = new Order({
            userId,
            items: orderItems,
            totalAmount: amount,
            paymentIntentId: paymentIntent.id,
            customerDetails,
            paymentStatus: 'pending'
        });

        await order.save();

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            orderId: order._id,
            message: 'Payment intent created successfully'
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create payment intent',
            error: error.message
        });
    }
});

// Confirm payment and update order status
export const confirmPayment = asyncHandler(async (req, res) => {
    try {
        const { paymentIntentId, orderId } = req.body;
        
        console.log('Confirming payment:', { paymentIntentId, orderId });

        if (!paymentIntentId || !orderId) {
            return res.status(400).json({
                success: false,
                message: 'Missing paymentIntentId or orderId'
            });
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        console.log('Stripe payment intent status:', paymentIntent.status);

        // Find order in database
        const order = await Order.findById(orderId);
        console.log('Order found:', order ? 'Yes' : 'No');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order based on payment status
        if (paymentIntent.status === 'succeeded') {
            order.paymentStatus = 'completed';
            order.orderStatus = 'pending'; // Keep as pending until admin accepts
            await order.save();

            const generatedCards = [];

            for (const item of order.items) {
                const isGiftCardProduct = await GiftCard.findById(item.menuItemId);
                
                if (isGiftCardProduct) {
                    // Generate a card for each quantity purchased
                    for (let i = 0; i < item.quantity; i++) {
                        const newCode = generateGiftCode();
                        const issuedCard = await IssuedGiftCard.create({
                            code: newCode,
                            originalOrderId: order._id,
                            initialValue: item.price,
                            currentBalance: item.price,
                            status: 'active'
                        });
                        generatedCards.push({ code: newCode, amount: item.price, name: item.name });
                    }
                }
            }
            
            // Send order confirmation email
            await sendOrderConfirmationEmail(order);
            
            // Send Gift Card Email if applicable
            try {
                if (generatedCards.length > 0) {
                    await sendGiftCardEmail(order.customerDetails, generatedCards);
                }
            } catch (emailError) {
                console.error('Gift card email failed:', emailError);
            }
            
            console.log('Payment confirmation successful, sending success response');
            res.status(200).json({
                success: true,
                message: 'Payment confirmed successfully',
                order: {
                    id: order._id,
                    paymentStatus: order.paymentStatus,
                    orderStatus: order.orderStatus,
                    totalAmount: order.totalAmount
                }
            });
        } else {
            console.log('Payment intent status not succeeded:', paymentIntent.status);
            order.paymentStatus = 'failed';
            await order.save();

            res.status(400).json({
                success: false,
                message: 'Payment failed',
                paymentStatus: paymentIntent.status
            });
        }

    } catch (error) {
        console.error('Payment confirmation error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Failed to confirm payment',
            error: error.message
        });
    }
});

// Get order details
export const getOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: orderId, userId })
            .populate('userId', 'name email')
            .populate('items.menuItemId', 'name category');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve order',
            error: error.message
        });
    }
});

// Get user's orders
export const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const orders = await Order.find({ userId })
            .populate('items.menuItemId', 'name category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments({ userId });

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasNext: page < Math.ceil(totalOrders / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get user orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
});

// Admin: Get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;
        const status = req.query.status;

        let query = {};
        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('userId', 'name email contact')
            .populate('items.menuItemId', 'name category')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalOrders = await Order.countDocuments(query);

        res.status(200).json({
            success: true,
            orders,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalOrders / limit),
                totalOrders,
                hasNext: page < Math.ceil(totalOrders / limit),
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders',
            error: error.message
        });
    }
});

// Admin: Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid order status'
            });
        }

        // Get the order before updating to check if we need to send email
        const orderBeforeUpdate = await Order.findById(orderId);
        
        if (!orderBeforeUpdate) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        const order = await Order.findByIdAndUpdate(
            orderId,
            { orderStatus },
            { new: true }
        ).populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Send email if status is changed to 'ready'
        if (orderStatus === 'ready' && orderBeforeUpdate.orderStatus !== 'ready') {
            try {
                await sendOrderReadyEmail(order);
            } catch (emailError) {
                console.error('Error sending ready email:', emailError);
                // Don't fail the request if email fails
            }
        }

        // Send email if status is changed to 'delivered'
        if (orderStatus === 'delivered' && orderBeforeUpdate.orderStatus !== 'delivered') {
            try {
                await sendOrderDeliveredEmail(order);
            } catch (emailError) {
                console.error('Error sending delivered email:', emailError);
                // Don't fail the request if email fails
            }
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order
        });

    } catch (error) {
        console.error('Update order status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
});

// Admin: Get monthly income
export const getMonthlyIncome = asyncHandler(async (req, res) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const result = await Order.aggregate([
        {
            $match: {
                paymentStatus: 'completed', // Only count paid orders
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
            }
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: "$totalAmount" }
            }
        }
    ]);
    // Return the sum or 0 if no orders found
    res.status(200).json({ 
        income: result.length > 0 ? result[0].totalIncome : 0 
    });
});

// Function to send order acceptance email
const sendOrderAcceptanceEmail = async (order) => {
    try {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const orderItemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong><br>
                    <span style="color: #666; font-size: 12px;">Quantity: ${item.quantity}</span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    LKR ${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    table { width: 100%; border-collapse: collapse; }
                    .total { font-size: 18px; font-weight: bold; color: #28a745; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Order Accepted!</h1>
                        <p>Your order is now being prepared</p>
                    </div>
                    <div class="content">
                        <p>Dear ${order.customerDetails.name},</p>
                        <p>Great news! Your order has been accepted and our kitchen is now preparing your delicious meal.</p>
                        
                        <div class="order-details">
                            <h2 style="color: #28a745; margin-top: 0;">Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${orderDate}</p>
                            <p><strong>Status:</strong> <span style="color: #28a745;">Preparing</span></p>
                            
                            <h3 style="margin-top: 20px;">Order Items:</h3>
                            <table>
                                ${orderItemsHtml}
                                <tr>
                                    <td style="padding: 15px 10px; border-top: 2px solid #28a745; font-weight: bold;">
                                        Total Amount
                                    </td>
                                    <td style="padding: 15px 10px; border-top: 2px solid #28a745; text-align: right;" class="total">
                                        LKR ${order.totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            </table>
                        </div>
                        
                        <div style="background: #d4edda; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28a745;">
                            <h3 style="margin-top: 0; color: #155724;">What's Next?</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Our chefs are preparing your meal with care</li>
                                <li>You'll be notified when your order is ready</li>
                                <li>Estimated preparation time: 30-45 minutes</li>
                            </ul>
                        </div>
                        
                        <p>Thank you for choosing HotGrill!</p>
                        
                        <div class="footer">
                            <p>HotGrill Restaurant<br>
                            Email: info@hotgrill.com</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.customerDetails.email,
            subject: `Order Accepted - HotGrill (Order #${order._id.toString().slice(-8)})`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log('Order acceptance email sent successfully to:', order.customerDetails.email);
    } catch (error) {
        console.error('Error sending order acceptance email:', error);
    }
};

// Function to send order cancellation email with refund details
const sendOrderCancellationEmail = async (order, refundAmount) => {
    try {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    .refund-box { background: #fff3cd; padding: 20px; border-radius: 5px; border-left: 4px solid #ffc107; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>Order Cancelled</h1>
                        <p>Your order has been cancelled</p>
                    </div>
                    <div class="content">
                        <p>Dear ${order.customerDetails.name},</p>
                        <p>We regret to inform you that your order has been cancelled.</p>
                        
                        <div class="order-details">
                            <h2 style="color: #dc3545; margin-top: 0;">Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${orderDate}</p>
                            <p><strong>Status:</strong> <span style="color: #dc3545;">Cancelled</span></p>
                        </div>
                        
                        <div class="refund-box">
                            <h3 style="margin-top: 0; color: #856404;">💰 Refund Information</h3>
                            <p><strong>Refund Amount:</strong> LKR ${refundAmount.toFixed(2)}</p>
                            <p>Your refund has been processed and will be credited back to your original payment method within 5-10 business days.</p>
                            <p style="font-size: 12px; color: #856404; margin-top: 15px;">
                                Note: The actual time may vary depending on your bank or card issuer.
                            </p>
                        </div>
                        
                        <p>We apologize for any inconvenience caused. If you have any questions, please don't hesitate to contact us.</p>
                        <p>We hope to serve you again soon!</p>
                        
                        <div class="footer">
                            <p>HotGrill Restaurant<br>
                            Email: info@hotgrill.com</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.customerDetails.email,
            subject: `Order Cancelled - Refund Processed (Order #${order._id.toString().slice(-8)})`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log('Order cancellation email sent successfully to:', order.customerDetails.email);
    } catch (error) {
        console.error('Error sending order cancellation email:', error);
    }
};

// Function to send order ready email
const sendOrderReadyEmail = async (order) => {
    try {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const orderItemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong><br>
                    <span style="color: #666; font-size: 12px;">Quantity: ${item.quantity}</span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    LKR ${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        // Build address HTML if available
        const addressHtml = order.customerDetails.address && 
            (order.customerDetails.address.street || order.customerDetails.address.city) 
            ? `
                <p style="margin: 5px 0;">
                    ${order.customerDetails.address.street || ''}<br>
                    ${order.customerDetails.address.city || ''} ${order.customerDetails.address.postalCode || ''}<br>
                    ${order.customerDetails.address.country || 'Sri Lanka'}
                </p>
            ` : '<p style="margin: 5px 0; color: #666;">No address provided</p>';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #FF991C 0%, #e08918 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    table { width: 100%; border-collapse: collapse; }
                    .total { font-size: 18px; font-weight: bold; color: #FF991C; }
                    .ready-box { background: #fff3e0; padding: 20px; border-radius: 5px; border-left: 4px solid #FF991C; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Your Order is Ready!</h1>
                        <p>Come and pick up your delicious meal</p>
                    </div>
                    <div class="content">
                        <p>Dear ${order.customerDetails.name},</p>
                        <p>Great news! Your order is ready for pickup. Our kitchen team has prepared your meal with care and it's waiting for you!</p>
                        
                        <div class="order-details">
                            <h2 style="color: #FF991C; margin-top: 0;">Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${orderDate}</p>
                            <p><strong>Status:</strong> <span style="color: #FF991C; font-weight: bold;">Ready for Pickup</span></p>
                            
                            <h3 style="margin-top: 20px;">Order Items:</h3>
                            <table>
                                ${orderItemsHtml}
                                <tr>
                                    <td style="padding: 15px 10px; border-top: 2px solid #FF991C; font-weight: bold;">
                                        Total Amount
                                    </td>
                                    <td style="padding: 15px 10px; border-top: 2px solid #FF991C; text-align: right;" class="total">
                                        LKR ${order.totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            </table>
                            
                            <h3 style="margin-top: 20px;">Delivery Information:</h3>
                            <p><strong>Name:</strong> ${order.customerDetails.name}</p>
                            <p><strong>Email:</strong> ${order.customerDetails.email}</p>
                            <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
                            <p><strong>Address:</strong></p>
                            ${addressHtml}
                        </div>
                        
                        <div class="ready-box">
                            <h3 style="margin-top: 0; color: #E65100;">📦 Pickup Instructions</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Your order is ready and waiting for you at the restaurant</li>
                                <li>Please come to collect your order as soon as possible</li>
                                <li>Bring a valid ID for order verification</li>
                                <li>If you have any questions, please contact us at ${order.customerDetails.phone || 'our contact number'}</li>
                            </ul>
                        </div>
                        
                        <p>We look forward to serving you!</p>
                        <p>Thank you for choosing HotGrill!</p>
                        
                        <div class="footer">
                            <p>HotGrill Restaurant<br>
                            Email: info@hotgrill.com</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.customerDetails.email,
            subject: `Order Ready for Pickup - HotGrill (Order #${order._id.toString().slice(-8)})`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log('Order ready email sent successfully to:', order.customerDetails.email);
    } catch (error) {
        console.error('Error sending order ready email:', error);
    }
};

// Function to send order delivered email
const sendOrderDeliveredEmail = async (order) => {
    try {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const orderItemsHtml = order.items.map(item => `
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong>${item.name}</strong><br>
                    <span style="color: #666; font-size: 12px;">Quantity: ${item.quantity}</span>
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    LKR ${(item.price * item.quantity).toFixed(2)}
                </td>
            </tr>
        `).join('');

        // Build address HTML if available
        const addressHtml = order.customerDetails.address && 
            (order.customerDetails.address.street || order.customerDetails.address.city) 
            ? `
                <p style="margin: 5px 0;">
                    ${order.customerDetails.address.street || ''}<br>
                    ${order.customerDetails.address.city || ''} ${order.customerDetails.address.postalCode || ''}<br>
                    ${order.customerDetails.address.country || 'Sri Lanka'}
                </p>
            ` : '<p style="margin: 5px 0; color: #666;">No address provided</p>';

        const htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .order-details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
                    table { width: 100%; border-collapse: collapse; }
                    .total { font-size: 18px; font-weight: bold; color: #28a745; }
                    .delivered-box { background: #d4edda; padding: 20px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>✅ Order Delivered!</h1>
                        <p>Thank you for choosing HotGrill</p>
                    </div>
                    <div class="content">
                        <p>Dear ${order.customerDetails.name},</p>
                        <p>We're excited to let you know that your order has been successfully delivered! We hope you're enjoying your delicious meal from HotGrill.</p>
                        
                        <div class="order-details">
                            <h2 style="color: #28a745; margin-top: 0;">Order Details</h2>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Order Date:</strong> ${orderDate}</p>
                            <p><strong>Status:</strong> <span style="color: #28a745; font-weight: bold;">Delivered</span></p>
                            
                            <h3 style="margin-top: 20px;">Order Items:</h3>
                            <table>
                                ${orderItemsHtml}
                                <tr>
                                    <td style="padding: 15px 10px; border-top: 2px solid #28a745; font-weight: bold;">
                                        Total Amount
                                    </td>
                                    <td style="padding: 15px 10px; border-top: 2px solid #28a745; text-align: right;" class="total">
                                        LKR ${order.totalAmount.toFixed(2)}
                                    </td>
                                </tr>
                            </table>
                            
                            <h3 style="margin-top: 20px;">Delivery Information:</h3>
                            <p><strong>Name:</strong> ${order.customerDetails.name}</p>
                            <p><strong>Email:</strong> ${order.customerDetails.email}</p>
                            <p><strong>Phone:</strong> ${order.customerDetails.phone}</p>
                            <p><strong>Address:</strong></p>
                            ${addressHtml}
                        </div>
                        
                        <div class="delivered-box">
                            <h3 style="margin-top: 0; color: #155724;">🎉 Thank You!</h3>
                            <ul style="margin: 10px 0; padding-left: 20px;">
                                <li>Your order has been successfully delivered</li>
                                <li>We hope you enjoyed your meal!</li>
                                <li>If you have any feedback or concerns, please don't hesitate to contact us</li>
                                <li>We'd love to hear from you - please consider leaving a review</li>
                            </ul>
                        </div>
                        
                        <p>We appreciate your business and look forward to serving you again soon!</p>
                        <p>Thank you for choosing HotGrill!</p>
                        
                        <div class="footer">
                            <p>HotGrill Restaurant<br>
                            Email: info@hotgrill.com</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: order.customerDetails.email,
            subject: `Order Delivered - HotGrill (Order #${order._id.toString().slice(-8)})`,
            html: htmlContent
        };

        await transporter.sendMail(mailOptions);
        console.log('Order delivered email sent successfully to:', order.customerDetails.email);
    } catch (error) {
        console.error('Error sending order delivered email:', error);
    }
};

// Admin: Accept order (moves from pending to preparing)
export const acceptOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Can only accept orders that are pending and payment completed
        if (order.paymentStatus !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Cannot accept order with incomplete payment'
            });
        }

        if (order.orderStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Order must be in pending status to accept'
            });
        }

        // Update order status to preparing
        order.orderStatus = 'preparing';
        await order.save();

        // Send acceptance email
        await sendOrderAcceptanceEmail(order);

        res.status(200).json({
            success: true,
            message: 'Order accepted successfully',
            order
        });

    } catch (error) {
        console.error('Accept order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to accept order',
            error: error.message
        });
    }
});

// Admin: Cancel order with refund
export const cancelOrderAdmin = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const { reason } = req.body;

        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Cannot cancel already cancelled or delivered orders
        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order is already cancelled'
            });
        }

        if (order.orderStatus === 'delivered') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel delivered orders'
            });
        }

        // Process refund if payment was completed
        if (order.paymentStatus === 'completed' && order.paymentIntentId) {
            try {
                // Create refund in Stripe
                const refund = await stripe.refunds.create({
                    payment_intent: order.paymentIntentId,
                    reason: 'requested_by_customer'
                });

                order.paymentStatus = 'refunded';
                
                console.log('Refund processed:', refund.id);
            } catch (stripeError) {
                console.error('Stripe refund error:', stripeError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to process refund',
                    error: stripeError.message
                });
            }
        }

        // Update order status
        order.orderStatus = 'cancelled';
        order.notes = (order.notes || '') + `\nCancelled by admin. Reason: ${reason || 'No reason provided'}`;
        await order.save();

        // Delete associated issued gift cards if any
        await IssuedGiftCard.deleteMany({ originalOrderId: order._id });

        // Send cancellation email with refund details (use order.totalAmount in LKR)
        await sendOrderCancellationEmail(order, order.totalAmount);

        res.status(200).json({
            success: true,
            message: 'Order cancelled and refund processed successfully',
            order,
            refundAmount: order.totalAmount // Return LKR amount for frontend
        });

    } catch (error) {
        console.error('Cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message
        });
    }
});

// User: Cancel own order (only before admin accepts)
export const cancelOrderUser = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;
        const { reason } = req.body;

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Users cannot cancel after admin has accepted (moved to preparing status)
        if (order.orderStatus !== 'confirmed' && order.orderStatus !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel order. Order is already being prepared or has been processed.'
            });
        }

        // Cannot cancel already cancelled orders
        if (order.orderStatus === 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Order is already cancelled'
            });
        }

        // Process refund if payment was completed
        if (order.paymentStatus === 'completed' && order.paymentIntentId) {
            try {
                // Create refund in Stripe
                const refund = await stripe.refunds.create({
                    payment_intent: order.paymentIntentId,
                    reason: 'requested_by_customer'
                });

                order.paymentStatus = 'refunded';
                
                console.log('Refund processed:', refund.id);
            } catch (stripeError) {
                console.error('Stripe refund error:', stripeError);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to process refund',
                    error: stripeError.message
                });
            }
        }

        // Update order status
        order.orderStatus = 'cancelled';
        order.notes = (order.notes || '') + `\nCancelled by user. Reason: ${reason || 'No reason provided'}`;
        await order.save();

        // Delete associated issued gift cards if any
        await IssuedGiftCard.deleteMany({ originalOrderId: order._id });

        // Send cancellation email with refund details (use order.totalAmount in LKR)
        await sendOrderCancellationEmail(order, order.totalAmount);

        res.status(200).json({
            success: true,
            message: 'Order cancelled successfully. Refund will be processed within 5-10 business days.',
            order,
            refundAmount: order.totalAmount // Return LKR amount for frontend
        });

    } catch (error) {
        console.error('User cancel order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel order',
            error: error.message
        });
    }
});

// User: Delete own order (only for pending/failed/cancelled)
export const deleteOrder = asyncHandler(async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: orderId, userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Users can only delete orders with pending, failed, or cancelled status
        const deletableStatuses = ['pending', 'cancelled'];
        const deletablePaymentStatuses = ['pending', 'failed', 'refunded'];

        if (!deletableStatuses.includes(order.orderStatus) || 
            !deletablePaymentStatuses.includes(order.paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete this order. Only pending, failed, or cancelled orders can be deleted.'
            });
        }

        await Order.findByIdAndDelete(orderId);

        res.status(200).json({
            success: true,
            message: 'Order deleted successfully',
            orderId: orderId
        });

    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
});