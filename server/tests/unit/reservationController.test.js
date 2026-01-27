import { jest } from '@jest/globals';
import httpMocks from 'node-mocks-http';

// 1. Mock Reservation Model
const mockReservationCreate = jest.fn();
const mockReservationFind = jest.fn();
const mockReservationModel = {
    create: mockReservationCreate,
    find: mockReservationFind,
    // Add others if needed
};

jest.unstable_mockModule('../../models/reservation.model.js', () => ({
    default: mockReservationModel
}));

// 2. Mock Config Model
const mockConfigFindOne = jest.fn();
const mockConfigModel = {
    findOne: mockConfigFindOne
};

jest.unstable_mockModule('../../models/config.model.js', () => ({
    default: mockConfigModel
}));

// 3. Dynamic Import
const { createReservation } = await import('../../controllers/reservation.controller.js');

describe('Reservation Controller Unit Tests', () => {
    let req, res, next;

    beforeEach(() => {
        req = httpMocks.createRequest();
        res = httpMocks.createResponse();
        next = jest.fn();
        
        // Mock socket.io instance attached to app
        req.app = {
            get: jest.fn().mockReturnValue({ emit: jest.fn() })
        };
        jest.clearAllMocks();
    });

    it('should create a reservation with "Unassigned" or "Conflict" table if conflicts exist', async () => {
        req.body = {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '1234567890',
            date: '2026-02-14',
            time: '19:00',
            guests: 2
        };

        // Mock Config (Total tables = 2)
        mockConfigFindOne.mockResolvedValue({ value: 2 });

        // Mock existing reservations (All tables booked)
        mockReservationFind.mockResolvedValue([
            { tableNumber: 'T1' },
            { tableNumber: 'T2' }
        ]);

        // Mock Creation
        mockReservationCreate.mockImplementation((data) => Promise.resolve({ ...data, _id: 'res123' }));

        await createReservation(req, res, next);

        expect(res.statusCode).toBe(201);
        const data = res._getJSONData();
        
        // Based on your controller logic, if no tables available, it sets "Conflict"
        expect(data.tableNumber).toBe('Conflict'); 
        expect(data.notes).toContain('System Alert'); 
    });
});