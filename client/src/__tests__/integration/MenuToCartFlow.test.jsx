import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MenuDisplay from '../../components/MenuDisplay';
import { CartProvider } from '../../utils/CartContext'; 
import axios from 'axios';

jest.mock('axios');

const mockMenuItems = [
    {
        _id: '101',
        name: 'Integration Burger',
        description: 'Test Burger',
        price: 1000,
        category: 'Breakfast', 
        imageUrl: '/burger.jpg',
        isAvailable: true
    }
];

describe('Integration: Menu to Cart Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        
        // --- KEY FIX: Mock LocalStorage BEFORE rendering ---
        // This ensures CartContext sees a token and uses API mode
        const localStorageMock = (function() {
            let store = {
                'token': 'mock-auth-token' // Pre-fill token
            };
            return {
                getItem: jest.fn(key => store[key] || null),
                setItem: jest.fn((key, value) => { store[key] = value.toString(); }),
                removeItem: jest.fn(key => { delete store[key]; }),
                clear: jest.fn(() => { store = {}; })
            };
        })();
        
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock
        });

        // Mock API responses
        axios.get.mockImplementation((url) => {
            if (url.includes('/menu')) return Promise.resolve({ data: mockMenuItems });
            if (url.includes('/cart')) return Promise.resolve({ data: [] });
            return Promise.resolve({ data: {} });
        });

        axios.post.mockResolvedValue({ 
            data: { 
                _id: 'cart_101', 
                item: { ...mockMenuItems[0], _id: '101' }, 
                quantity: 1, 
                itemType: 'MenuItem' 
            } 
        });
    });

    it('Adding an item from Menu updates the Add button to quantity controls', async () => {
        render(
            <CartProvider>
                <MenuDisplay />
            </CartProvider>
        );

        // 1. Wait for menu to load
        await waitFor(() => expect(screen.getByText('Integration Burger')).toBeInTheDocument());

        // 2. Find Add to Cart button
        const addBtn = screen.getByText('Add to Cart');
        expect(addBtn).toBeInTheDocument();

        // 3. Click Add
        fireEvent.click(addBtn);

        // 4. Verify API call (Now it should work because token exists)
        await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

        // 5. Check if button changed to Quantity controls
        await waitFor(() => {
            expect(screen.getByText('1')).toBeInTheDocument(); 
        });
    });
});