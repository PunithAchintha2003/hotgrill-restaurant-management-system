import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';
import mongoose from 'mongoose';

// 1. Create mock functions
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockFindOneAndDelete = jest.fn();
const mockDeleteMany = jest.fn();

// 2. Register the mock
jest.unstable_mockModule('../../models/cart.model.js', () => ({
    CartModel: {
        findOne: mockFindOne,
        create: mockCreate,
        findOneAndUpdate: mockFindOneAndUpdate,
        findOneAndDelete: mockFindOneAndDelete,
        deleteMany: mockDeleteMany
    }
}));

// 3. Dynamic Import
const { addToCart } = await import('../../controllers/cart.controller.js');
const { CartModel } = await import('../../models/cart.model.js'); // Import the mocked model to check calls

describe('Cart Controller Unit Tests', () => {
    let req, res, next;
    const userId = new mongoose.Types.ObjectId();
    const itemId = new mongoose.Types.ObjectId();

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        req.user = { id: userId.toString() };
        jest.clearAllMocks();
    });

    it('addToCart should create a new item if it does not exist', async () => {
        req.body = { itemId: itemId.toString(), quantity: 2 };

        // Mock finding no existing item
        mockFindOne.mockResolvedValue(null);
        
        // Mock creation response
        const mockCreatedItem = {
            _id: 'cart123',
            user: userId,
            item: itemId,
            quantity: 2,
            itemModel: 'MenuItem',
            populate: jest.fn().mockResolvedValue({
                _id: 'cart123',
                item: { _id: itemId, name: 'Burger', price: 500, imageUrl: 'img.jpg' },
                quantity: 2,
                itemModel: 'MenuItem'
            })
        };
        mockCreate.mockResolvedValue(mockCreatedItem);

        await addToCart(req, res, next);

        expect(mockCreate).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        const data = res._getJSONData();
        expect(data.quantity).toBe(2);
    });

    it('addToCart should update quantity if item exists', async () => {
        req.body = { itemId: itemId.toString(), quantity: 1 };

        const existingCartItem = {
            _id: 'cart123',
            quantity: 1
        };

        // Mock finding item
        mockFindOne.mockResolvedValue(existingCartItem);

        // Mock updating item
        mockFindOneAndUpdate.mockReturnValue({
            populate: jest.fn().mockResolvedValue({
                _id: 'cart123',
                item: { _id: itemId, imageUrl: 'img.jpg' },
                quantity: 2, // 1 existing + 1 new
                itemModel: 'MenuItem'
            })
        });

        await addToCart(req, res, next);

        expect(mockFindOneAndUpdate).toHaveBeenCalled();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData().quantity).toBe(2);
    });
});