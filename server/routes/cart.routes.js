import express from 'express';
import { getCart, addToCart, updateCartItem, removeCartItem, clearCart } from '../controllers/cart.controller.js';
import {createRequire} from 'module';
import auth from '../middleware/auth.js';

const cartRouter = express.Router();

cartRouter.use(auth);

cartRouter.route('/')
    .get(getCart)
    .post(addToCart)

cartRouter.delete('/clear', clearCart);

cartRouter.route('/:id')
    .put(updateCartItem)
    .delete(removeCartItem);

export default cartRouter;