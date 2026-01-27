import React, { useContext, createContext, useEffect, useCallback, useReducer } from "react";
import axios from "axios";

const CartContext = createContext();

const API_URL = "http://localhost:4000/api/cart";

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'SET_CART':
            return action.payload;
        case 'ADD_ITEM': {
            const { item, quantity } = action.payload;
            const existingItem = state.find(i => i.id === item.id);
            if (existingItem) {
                return state.map(i => i.id === item.id ? { ...i, quantity } : i);
            }
            return [...state, { ...item, quantity }];
        }
        case 'REMOVE_ITEM': {
            return state.filter(i => i.id !== action.payload.itemId);
        }
        case 'UPDATE_QUANTITY': {
            const { itemId, newQuantity } = action.payload;
            return state.map(i => i.id === itemId ? { ...i, quantity: Math.max(1, newQuantity) } : i);
        }
        default:
            return state;
    }
};

const initializer = () => {
    if (typeof window !== 'undefined') {
        const localCart = localStorage.getItem('cart');
        return localCart ? JSON.parse(localCart) : [];
    }
    return [];
};

export const CartProvider = ({ children }) => {
    const [cartItems, dispatch] = useReducer(cartReducer, [], initializer);
    const token = localStorage.getItem('token');

    const getHeaders = () => ({
        headers: { 'x-auth-token': token }
    });

    useEffect(() => {
        if (token) {
            const fetchBackendCart = async () => {
                try {
                    const res = await axios.get(API_URL, getHeaders());
                    const mappedCart = res.data
                    .filter(cartItem => cartItem.item !== null)
                    .map(cartItem => ({
                        ...cartItem.item,
                        id: cartItem.item._id,
                        cartItemId: cartItem._id,
                        quantity: cartItem.quantity,
                        itemType: cartItem.itemType, // Store type locally
                        image: cartItem.item.imageUrl.startsWith('http') 
                               ? cartItem.item.imageUrl 
                               : `http://localhost:4000${cartItem.item.imageUrl}`
                    }));
                    dispatch({ type: 'SET_CART', payload: mappedCart });
                } catch (error) {
                    console.error("Failed to fetch cart:", error);
                }
            };
            fetchBackendCart();
        }
    }, [token]);

    useEffect(() => {
        if (!token) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        }
    }, [cartItems, token]);

    const removeFromCart = useCallback(async (itemId) => {
        dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });

        if (token) {
            const targetItem = cartItems.find(i => i.id === itemId);
            if (!targetItem?.cartItemId) return; 

            try {
                await axios.delete(`${API_URL}/${targetItem.cartItemId}`, getHeaders());
            } catch (error) {
                console.error("Error removing from cart API", error);
            }
        }
    }, [token, cartItems]);

    const updateQuantity = useCallback(async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
            return;
        }

        dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, newQuantity } });

        if (token) {
            const targetItem = cartItems.find(i => i.id === itemId);
            if (!targetItem?.cartItemId) return;

            try {
                await axios.put(`${API_URL}/${targetItem.cartItemId}`, { quantity: newQuantity }, getHeaders());
            } catch (error) {
                console.error("Error updating quantity API", error);
                if (error.response && error.response.status === 404) {
                    dispatch({ type: 'REMOVE_ITEM', payload: { itemId } });
                }
            }
        }
    }, [token, cartItems, removeFromCart]);

    // Accept itemType, default to 'MenuItem'
    const addToCart = useCallback(async (item, quantity, itemType = 'MenuItem') => {
        if (token) {
            try {
                const res = await axios.post(API_URL, { 
                    itemId: item.id, 
                    quantity,
                    itemType
                }, getHeaders());
                
                if(res.data.deleted) {
                    dispatch({ type: 'REMOVE_ITEM', payload: { itemId: item.id }});
                    return;
                }

                if (!res.data.item) {
                    throw new Error("Backend returned null item. ID mismatch likely.");
                }

                const newItem = {
                    ...res.data.item,
                    id: res.data.item._id,
                    cartItemId: res.data._id,
                    quantity: res.data.quantity,
                    itemType: res.data.itemType,
                    image: res.data.item.imageUrl.startsWith('http') 
                           ? res.data.item.imageUrl 
                           : `http://localhost:4000${res.data.item.imageUrl}`
                };

                dispatch({ type: 'ADD_ITEM', payload: { item: newItem, quantity: newItem.quantity } });

            } catch (error) {
                console.error("Error adding to cart API", error);
            }
        } else {
            // Local Guest Cart Logic
            dispatch({ type: 'ADD_ITEM', payload: { item: { ...item, itemType }, quantity } });
        }
    }, [token]);

    const clearCart = useCallback(async () => {
        dispatch({ type: 'SET_CART', payload: [] });
        if (token) {
            try {
                await axios.delete(`${API_URL}/clear`, getHeaders());
            } catch (error) {
                console.error("Error clearing cart API", error);
            }
        }
    }, [token]);

    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const formatTotalItems = (num) => {
        if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
        return num;
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartTotal,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            totalItems: formatTotalItems(totalItemsCount)
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);