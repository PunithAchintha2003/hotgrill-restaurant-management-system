import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MenuDisplay from '../../components/MenuDisplay';
import { CartProvider } from '../../utils/CartContext';
import axios from 'axios';

// Mock axios
jest.mock('axios');

const mockMenuItems = [
    {
        _id: '1',
        name: 'Pancakes',
        description: 'Fluffy',
        price: 500,
        category: 'Breakfast',
        imageUrl: '/pancakes.jpg',
        isAvailable: true
    }
];

describe('MenuDisplay Integration', () => {
    it('fetches and displays menu items', async () => {
        axios.get.mockResolvedValue({ data: mockMenuItems });

        render(
            <CartProvider>
                <MenuDisplay />
            </CartProvider>
        );

        // Check loading state
        expect(screen.getByText(/Loading menu.../i)).toBeInTheDocument();

        // Wait for items to load
        await waitFor(() => {
            expect(screen.getByText('Pancakes')).toBeInTheDocument();
            expect(screen.getByText('LKR 500')).toBeInTheDocument();
        });
    });
});