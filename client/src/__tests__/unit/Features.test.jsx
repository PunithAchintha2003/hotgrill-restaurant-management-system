import React from 'react';
import { render, screen } from '@testing-library/react';
import Features from '../../components/home/Features';

describe('Features Component', () => {
    it('renders the main heading correctly', () => {
        render(<Features />);
        const heading = screen.getByText(/Why Choose Hotgrill?/i);
        expect(heading).toBeInTheDocument();
    });

    it('renders all feature cards', () => {
        render(<Features />);
        expect(screen.getByText('Fresh Ingredients')).toBeInTheDocument();
        expect(screen.getByText('Hot Foods')).toBeInTheDocument();
        expect(screen.getByText('Best Service')).toBeInTheDocument();
    });
});