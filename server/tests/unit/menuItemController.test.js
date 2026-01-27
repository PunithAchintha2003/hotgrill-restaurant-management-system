import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';

// 1. Define the mock factory
const mockSave = jest.fn();
const mockMenuItemModel = jest.fn(() => ({
    save: mockSave
}));

// Attach static methods used in the controller
mockMenuItemModel.find = jest.fn();
mockMenuItemModel.findById = jest.fn();
mockMenuItemModel.findByIdAndDelete = jest.fn();
mockMenuItemModel.findByIdAndUpdate = jest.fn();

// 2. Register the mock using unstable_mockModule BEFORE importing the controller
jest.unstable_mockModule('../../models/menuItem.model.js', () => ({
    default: mockMenuItemModel
}));

// 3. Dynamic imports
const { createMenuItem } = await import('../../controllers/menuItemController.js');

describe('MenuItem Controller Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        jest.clearAllMocks(); // Clear previous mock data
    });

    it('should create a menu item successfully', async () => {
        req.body = {
            name: 'Spicy Burger',
            description: 'Very spicy',
            price: 500,
            category: 'Lunch',
            isAvailable: true
        };
        // Mock file upload
        req.file = { filename: 'burger.jpg' };

        // Setup the save implementation for this specific test
        mockSave.mockResolvedValue({
            _id: '123',
            ...req.body,
            imageUrl: '/uploads/burger.jpg'
        });

        await createMenuItem(req, res, next);

        expect(res.statusCode).toBe(201);
        const jsonData = res._getJSONData();
        expect(jsonData.name).toBe('Spicy Burger');
        expect(jsonData.imageUrl).toBe('/uploads/burger.jpg');
        expect(mockMenuItemModel).toHaveBeenCalled(); // Ensure constructor was called
    });
});