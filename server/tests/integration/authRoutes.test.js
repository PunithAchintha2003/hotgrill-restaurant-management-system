import request from 'supertest';
import { createTestApp } from '../utils/testApp.js';
import { connect, close, clear } from '../setup.js';

const app = createTestApp();

beforeAll(async () => await connect());
afterEach(async () => await clear());
afterAll(async () => await close());

describe('Auth Integration Tests', () => {
    const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        contact: '0771234567'
    };

    it('POST /api/auth/signup should register a new user', async () => {
        const res = await request(app)
            .post('/api/auth/signup')
            .send(newUser);

        expect(res.statusCode).toBe(200);
        expect(res.body.msg).toContain('Successfully registered');
    });

    it('POST /api/auth/login should return a token for valid credentials', async () => {
        // Register first
        await request(app).post('/api/auth/signup').send(newUser);

        // Login
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: newUser.email,
                password: newUser.password
            });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.role).toBe('user');
    });

    it('POST /api/auth/login should fail with invalid password', async () => {
        await request(app).post('/api/auth/signup').send(newUser);

        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: newUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.msg).toBe('Invalid Credentials');
    });
});