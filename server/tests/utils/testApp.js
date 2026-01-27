import express from 'express';
import cors from 'cors';
import authRouter from '../../routes/auth.routes.js';
import cartRouter from '../../routes/cart.routes.js';
import reservationRouter from '../../routes/reservation.routes.js';
import menuItemRouter from '../../routes/menuItem.routes.js';

export const createTestApp = () => {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Mock socket.io for controllers that use it
    app.set('socketio', { emit: () => {} });

    // Mount Routes
    app.use("/api/auth", authRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/reservations", reservationRouter);
    app.use("/api/menu", menuItemRouter);

    return app;
};