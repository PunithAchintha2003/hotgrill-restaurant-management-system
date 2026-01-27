import request from 'supertest';
import express from 'express';
import menuRouter from '../../routes/menuItem.routes.js';
import { connect, close, clear } from '../setup.js';
import path from 'path';

// Setup Express App for testing
const app = express();
app.use(express.json());
app.use('/api/menu', menuRouter);

beforeAll(async () => await connect());
afterEach(async () => await clear());
afterAll(async () => await close());

describe('Menu Item Integration Tests', () => {
    it('GET /api/menu should return empty array initially', async () => {
        const res = await request(app).get('/api/menu');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('POST /api/menu should create a new item', async () => {
        const res = await request(app)
            .post('/api/menu')
            .field('name', 'Pasta')
            .field('description', 'Creamy pasta')
            .field('price', 1200)
            .field('category', 'Dinner')
            .field('isAvailable', true)
            // Attaching a dummy buffer as image
            .attach('image', Buffer.from('dummy'), 'test.jpg');

        expect(res.statusCode).toBe(201);
        expect(res.body.name).toBe('Pasta');
    });
});