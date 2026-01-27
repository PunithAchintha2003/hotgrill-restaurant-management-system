import request from 'supertest';
import { createTestApp } from '../utils/testApp.js';
import { connect, close, clear } from '../setup.js';
import Config from '../../models/config.model.js';

const app = createTestApp();

beforeAll(async () => {
    await connect();
    // Seed Config for tables
    await Config.create({ key: 'totalTables', value: 5 });
});
afterEach(async () => await clear());
afterAll(async () => await close());

describe('Reservation Integration Tests', () => {
    const bookingData = {
        name: 'Alice',
        email: 'alice@test.com',
        phone: '0999999999',
        date: '2026-05-20',
        time: '20:00',
        guests: 4
    };

    it('POST /api/reservations should create a confirmed reservation with assigned table', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .send(bookingData);

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Alice');
        // Logic should assign T1 as it's the first empty table
        expect(res.body.tableNumber).toBe('T1');
        expect(res.body.status).toBe('pending');
    });

    it('POST /api/reservations should handle missing fields', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .send({ name: 'Incomplete' });

        expect(res.statusCode).toBe(400);
    });
});