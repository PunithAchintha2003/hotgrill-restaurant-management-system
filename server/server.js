import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/dbConfig.js";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";


// Route Imports
import menuRouter from "./routes/menuItem.routes.js";
import cartRouter from "./routes/cart.routes.js";
import authRouter from "./routes/auth.routes.js";
import reviewRouter from "./routes/review.routes.js"; // 1. Added this import
import contactRouter from "./routes/contact.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import employeeRouter from "./routes/employee.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import reservationRouter from "./routes/reservation.routes.js";
import giftCardRouter from "./routes/giftCard.routes.js";
import adminRoute from './routes/adminRoute.js';

const app = express();

const PORT = process.env.PORT || 4000;

const allowedOrigins = [ "http://localhost:5173", "http://localhost:5174", "http://localhost", "http://localhost:80", "http://127.0.0.1", process.env.CLIENT_URL, process.env.CLIENT_URL_PROD ].filter(Boolean); // Remove any undefined env vars

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true
  }
});
// Store io instance in app for access in controllers
app.set('socketio', io);
io.on("connection", (socket) => {
  // Join an "admin" room for security later
  socket.on("join_admin", () => {
    socket.join("admin_room");
  });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors({ origin: allowedOrigins, credentials: true, methods: ["GET", "POST", "PUT", "DELETE"] }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB().then(() => {
  console.log("SUCCESS: Database connection established to MongoDB Cloud.");
}).catch((err) => {
  console.log("DATABASE ERROR: Connection failed. Details: ", err);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/api/menu", menuRouter);
app.use("/api/cart", cartRouter);
app.use("/api/auth", authRouter); 
app.use("/api/reviews", reviewRouter);// 2. Registered the auth route
app.use("/api/contact", contactRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/employees", employeeRouter);
app.use("/api/expenses", expenseRouter);
app.use("/api/reservations", reservationRouter);
app.use("/api/giftcards", giftCardRouter);
app.use("/api/users", adminRoute);

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

server.listen(PORT, () => {
  console.log(`Server is accessible on http://localhost:${PORT}`);
});