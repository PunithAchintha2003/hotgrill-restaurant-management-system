import React from 'react';
import { render, act, renderHook } from '@testing-library/react';
import { CartProvider, useCart } from '../../utils/CartContext';
import axios from 'axios';

// Mock Axios
jest.mock('axios');

// Helper to wrap hook in provider
const wrapper = ({ children }) => <CartProvider>{children}</CartProvider>;

describe('CartContext Unit Tests', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock localStorage to simulate a logged-in user
        // This ensures the Context takes the 'if (token)' path and calls the API
        jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
            if (key === 'token') return 'fake-auth-token';
            return null;
        });

        // Default cart fetch mock (empty)
        axios.get.mockResolvedValue({ data: [] });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should initialize with an empty cart', async () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        
        // Wait for initial fetch
        await act(async () => {});

        expect(result.current.cartItems).toEqual([]);
        expect(result.current.totalItems).toBe(0);
    });

    it('addToCart should add an item locally and call API', async () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        const mockItem = { id: '123', name: 'Burger', price: 500, imageUrl: '/img.png' };
        
        // Mock the POST response from server
        axios.post.mockResolvedValue({ 
            data: { _id: 'cart1', item: { ...mockItem, _id: '123' }, quantity: 1, itemType: 'MenuItem' } 
        });

        await act(async () => {
            await result.current.addToCart(mockItem, 1);
        });

        // Check Local State update
        expect(result.current.cartItems).toHaveLength(1);
        expect(result.current.cartItems[0].name).toBe('Burger');
        
        // Check API call
        expect(axios.post).toHaveBeenCalledWith(
            expect.stringContaining('/api/cart'),
            expect.objectContaining({ itemId: '123', quantity: 1 }),
            expect.any(Object)
        );
    });

    it('removeFromCart should remove item and call API', async () => {
        const { result } = renderHook(() => useCart(), { wrapper });
        const mockItem = { id: '123', name: 'Burger', price: 500, imageUrl: '/img.png' };

        // Setup: Add item first
        axios.post.mockResolvedValue({ 
            data: { _id: 'cart1', item: { ...mockItem, _id: '123' }, quantity: 1, itemType: 'MenuItem' } 
        });
        
        await act(async () => {
            await result.current.addToCart(mockItem, 1);
        });

        // Mock Delete response
        axios.delete.mockResolvedValue({ data: { _id: '123' } });

        // Action: Remove
        await act(async () => {
            await result.current.removeFromCart('123');
        });

        expect(result.current.cartItems).toHaveLength(0);
        expect(axios.delete).toHaveBeenCalled();
    });
});