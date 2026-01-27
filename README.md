# 🍽️ HotGrill Restaurant Management System

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-5.2.1-lightgrey.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue.svg)](.github/workflows/ci-cd.yml)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.yml)

> A comprehensive full-stack web application for restaurant management, featuring online ordering, table reservations, payment processing, gift card management, and a powerful admin dashboard with real-time notifications.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Docker Deployment](#docker-deployment)
- [Deployment](#deployment)
- [Security](#security)
- [Performance](#performance)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [License](#license)
- [Authors](#authors)
- [Acknowledgments](#acknowledgments)
- [Support](#support)

<a id="overview"></a>
## 🎯 Overview

HotGrill is a modern restaurant management system designed to streamline operations for both customers and restaurant administrators. The platform enables customers to browse menus, place orders, make reservations, purchase gift cards, and leave reviews, while providing administrators with comprehensive tools to manage products, orders, employees, expenses, and customer interactions.

### Key Highlights

- **Real-time Updates**: Socket.io integration for live order and notification updates
- **Secure Payments**: Stripe integration for secure payment processing
- **Responsive Design**: Modern UI built with React and TailwindCSS
- **RESTful API**: Well-structured backend API with Express.js
- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **File Upload**: Image upload support for menu items using Multer
- **Email Services**: Nodemailer integration for password reset and notifications
- **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions
- **Containerized**: Docker and Docker Compose support for easy deployment

<a id="features"></a>
## ✨ Features

### Customer Features

- **🔐 User Authentication**
  - Secure registration and login
  - Password reset via email OTP
  - Profile management
  - Account update with OTP verification

- **🍕 Menu & Ordering**
  - Browse menu items with images and descriptions
  - Search and filter menu items
  - Shopping cart management
  - Real-time order tracking
  - Order history in user dashboard

- **💳 Payment Processing**
  - Secure payment integration with Stripe
  - Multiple payment methods support
  - Payment success/failure handling
  - Order confirmation emails

- **📅 Table Reservations**
  - Book tables with date and time selection
  - View reservation history
  - Cancel reservations
  - Real-time availability checking

- **🎁 Gift Cards**
  - Purchase gift cards
  - Gift card redemption
  - View gift card balance and history

- **⭐ Reviews & Ratings**
  - Submit reviews with ratings
  - View all customer reviews
  - Edit and delete own reviews

- **📧 Contact & Support**
  - Contact form for inquiries
  - Message tracking in user dashboard

### Admin Features

- **📊 Dashboard**
  - Overview of orders, revenue, and key metrics
  - Real-time statistics and analytics
  - Recent activity monitoring
  - Socket.io notifications for new orders

- **🍽️ Product Management**
  - Create, update, and delete menu items
  - Image upload for menu items
  - Category management
  - Price and availability control

- **📦 Order Management**
  - View all customer orders
  - Update order status (pending, confirmed, preparing, ready, delivered, cancelled)
  - Filter and search orders
  - Order details and customer information

- **👥 User Management**
  - View all registered users
  - User account management
  - Role assignment (user/admin)

- **👨‍💼 Employee Management**
  - Add and manage staff members
  - Employee information tracking
  - Role-based access

- **📅 Reservation Management**
  - View all table reservations
  - Manage reservation status
  - Filter by date and status
  - Customer contact information

- **💬 Message Management**
  - View customer inquiries
  - Respond to messages
  - Message status tracking

- **💰 Expense Tracking**
  - Record restaurant expenses
  - Categorize expenses
  - View expense reports

- **🎁 Gift Card Management**
  - Create and manage gift cards
  - View gift card transactions
  - Redeem gift cards
  - Gift card analytics

- **⭐ Review Management**
  - View all customer reviews
  - Moderate reviews
  - Delete inappropriate reviews

<a id="tech-stack"></a>
## 🛠 Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.0 | UI library for building user interfaces |
| **Vite** | 7.2.4 | Build tool and development server |
| **React Router DOM** | 7.11.0 | Client-side routing |
| **TailwindCSS** | 4.1.18 | Utility-first CSS framework |
| **Axios** | 1.13.2 | HTTP client for API requests |
| **Stripe** | 5.4.1 / 8.6.1 | Payment processing integration |
| **React Icons** | 5.5.0 | Icon library |
| **React Hot Toast** | 2.6.0 | Toast notifications |
| **Socket.io Client** | 4.8.3 | Real-time communication |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | JavaScript runtime environment |
| **Express** | 5.2.1 | Web application framework |
| **MongoDB** | Latest | NoSQL database |
| **Mongoose** | 9.1.3 | MongoDB object modeling |
| **JWT** | 9.0.3 | Authentication tokens |
| **Bcryptjs** | 3.0.3 | Password hashing |
| **Stripe** | 20.2.0 | Payment processing |
| **Multer** | 2.0.2 | File upload handling |
| **Nodemailer** | 7.0.12 | Email service |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Socket.io** | 4.8.3 | Real-time bidirectional communication |
| **Express Async Handler** | 1.2.0 | Async error handling |

### Development Tools

- **Jest** | 30.2.0 | Testing framework
- **Supertest** | 7.2.2 | HTTP assertion library
- **MongoDB Memory Server** | 11.0.1 | In-memory MongoDB for testing
- **ESLint** | 9.39.1 | Code linting
- **Nodemon** | 3.1.11 | Development server auto-reload
- **Testing Library** | 16.3.2 | React component testing utilities

### DevOps

- **Docker** | Latest | Containerization
- **Docker Compose** | 3.8 | Multi-container orchestration
- **Nginx** | Alpine | Web server for production frontend
- **GitHub Actions** | - | CI/CD pipeline automation

<a id="architecture"></a>
## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (React)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │ Homepage │  │   Menu   │  │   Cart   │  │  Admin   │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         React Router (Client-side Routing)           │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Axios (HTTP Client) + Socket.io Client (Real-time)  │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP/REST API + WebSocket
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Server (Express.js)                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express Middleware Stack                │   │
│  │  CORS → Body Parser → Auth → Routes → Error Handler  │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │ Controllers  │  │  Middleware  │  │    Routes    │       │
│  └──────────────┘  └──────────────┘  └──────────────┘       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Socket.io Server (Real-time)            │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────────┘
                        │
        ┌───────────────┼────────────────┐
        │               │                │
┌───────▼──────┐  ┌─────▼──────┐  ┌──────▼──────┐
│   MongoDB    │  │   Stripe   │  │  Nodemailer │
│  (Database)  │  │  (Payment) │  │   (Email)   │
└──────────────┘  └────────────┘  └─────────────┘
```

### Data Flow

1. **Client Request**: User interacts with React frontend
2. **API Call**: Axios sends HTTP request to Express backend
3. **Authentication**: JWT middleware validates user token
4. **Controller**: Business logic processes the request
5. **Database**: Mongoose interacts with MongoDB
6. **Response**: JSON response sent back to client
7. **Real-time Updates**: Socket.io broadcasts updates to connected clients

## 🚀 Quick Start

Get the application running in 5 minutes:

```bash
# Clone the repository
git clone <repository-url>
cd coursework-group-29

# Install dependencies
cd server && npm install
cd ../client && npm install

# Set up environment variables (see Configuration section)
# Copy .env.example to .env and fill in your values

# Start MongoDB (if using local instance)
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Start the backend server
cd server && npm start

# In a new terminal, start the frontend
cd client && npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:4000
```

<a id="prerequisites"></a>
## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (v9 or higher) or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account) - [Download](https://www.mongodb.com/try/download/community) or [Atlas](https://www.mongodb.com/cloud/atlas)
- **Stripe Account** (for payment processing) - [Sign up](https://stripe.com)
- **Git** (for cloning the repository)
- **Docker & Docker Compose** (optional, for containerized deployment)

<a id="installation"></a>
## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coursework-group-29
```

### 2. Install Server Dependencies

```bash
cd server
npm install
```

### 3. Install Client Dependencies

```bash
cd ../client
npm install
```

<a id="configuration"></a>
## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/hotgrill
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hotgrill?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key

# Email Configuration (for password reset and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
# Note: For Gmail, use an App Password, not your regular password

# Admin Configuration
ADMIN_SECRET_KEY=your_admin_secret_key_for_creating_admin_accounts

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
CLIENT_URL_PROD=http://localhost:80
```

### Client Environment Variables

Create a `.env` file in the `client` directory (optional, can be set during build):

```env
VITE_API_URL=http://localhost:4000
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

### MongoDB Setup

#### Option 1: Local MongoDB

1. Install MongoDB locally from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   
   # Windows
   # Start MongoDB from Services
   ```
3. Use connection string: `mongodb://localhost:27017/hotgrill`

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and add it to `.env`

### Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Navigate to Developers → API keys
3. Copy your **Test** keys (for development)
4. Add them to your `.env` file
5. For production, use **Live** keys

### Email Setup (Gmail Example)

1. Enable 2-Factor Authentication on your Google account
2. Go to [Google App Passwords](https://myaccount.google.com/apppasswords)
3. Generate an app password for "Mail"
4. Use this app password in `EMAIL_PASSWORD` (not your regular password)

<a id="running-the-application"></a>
## 🏃 Running the Application

### Development Mode

#### Start Backend Server

```bash
cd server
npm start
```

The server will run on `http://localhost:4000`

#### Start Frontend Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173`

#### Access the Application

- **Frontend**: Open `http://localhost:5173` in your browser
- **Backend API**: `http://localhost:4000`
- **API Health Check**: `http://localhost:4000/`

### Production Build

#### Build Frontend

```bash
cd client
npm run build
```

This creates an optimized production build in the `client/dist` directory.

#### Start Production Server

```bash
cd server
npm start
```

The server will serve the built frontend files if configured, or you can use a separate web server like Nginx.

<a id="testing"></a>
## 🧪 Testing

### Running Tests

The project includes unit and integration tests using Jest and Supertest.

#### Run All Tests

```bash
# Server tests
cd server
npm test

# Client tests
cd client
npm test
```

#### Run Tests in Watch Mode

```bash
cd server
npm run test:watch
```

#### Run Tests with Coverage

```bash
# Server
cd server
npm test -- --coverage

# Client
cd client
npm test -- --coverage
```

### Test Structure

```
server/tests/
├── unit/
│   ├── cartController.test.js
│   ├── menuItemController.test.js
│   └── reservationController.test.js
├── integration/
│   ├── authRoutes.test.js
│   ├── menuItemRoutes.test.js
│   └── reservationRoutes.test.js
├── utils/
│   └── testApp.js
└── setup.js

client/src/__tests__/
├── unit/
│   ├── CartContext.test.jsx
│   └── Features.test.jsx
└── integration/
    ├── MenuDisplay.test.jsx
    └── MenuToCartFlow.test.jsx
```

### CI/CD Testing

The project includes automated testing via GitHub Actions. Tests run on every push to the main branch, ensuring code quality and preventing regressions.

<a id="project-structure"></a>
## 📁 Project Structure

```
coursework-group-29/
├── client/                          # Frontend React application
│   ├── public/                      # Static public files
│   ├── src/
│   │   ├── assets/                  # Images, logos, etc.
│   │   ├── components/              # Reusable React components
│   │   │   ├── admin/               # Admin-specific components
│   │   │   │   ├── adminNav.jsx
│   │   │   │   ├── adminNotifications.jsx
│   │   │   │   ├── employeeForm.jsx
│   │   │   │   └── productForm.jsx
│   │   │   ├── home/                # Homepage components
│   │   │   │   ├── Features.jsx
│   │   │   │   ├── Hero.jsx
│   │   │   │   ├── HotgrillSpecials.jsx
│   │   │   │   └── RestaurantReviews.jsx
│   │   │   ├── AdminRoute.jsx       # Admin route protection
│   │   │   ├── ProtectedRoute.jsx   # User route protection
│   │   │   ├── cartItems.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── MenuDisplay.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── PaymentForm.jsx
│   │   │   └── ReviewsDisplay.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Admin/               # Admin dashboard pages
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── adminEmployees.jsx
│   │   │   │   ├── adminGiftCards.jsx
│   │   │   │   ├── adminMessages.jsx
│   │   │   │   ├── adminOrder.jsx
│   │   │   │   ├── adminProducts.jsx
│   │   │   │   ├── adminReservations.jsx
│   │   │   │   ├── adminReviews.jsx
│   │   │   │   ├── adminUsers.jsx
│   │   │   │   └── AdminRedeem.jsx
│   │   │   ├── auth/                 # Authentication pages
│   │   │   │   ├── login.jsx
│   │   │   │   ├── signup.jsx
│   │   │   │   ├── forgetpassword.jsx
│   │   │   │   └── resetpassword.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── giftCards.jsx
│   │   │   ├── Homepage.jsx
│   │   │   ├── Menu.jsx
│   │   │   ├── Payment.jsx
│   │   │   ├── PaymentSuccess.jsx
│   │   │   ├── PaymentFailed.jsx
│   │   │   ├── Reservations.jsx
│   │   │   ├── Reviews.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── privacyPolicy.jsx
│   │   │   └── serviceTerms.jsx
│   │   ├── utils/                    # Utility functions
│   │   │   └── CartContext.jsx        # Cart state management
│   │   ├── data/                     # Dummy data
│   │   │   └── dummyData.jsx
│   │   ├── __tests__/                # Test files
│   │   │   ├── unit/
│   │   │   └── integration/
│   │   ├── App.jsx                   # Main app component
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── eslint.config.js
│   ├── index.html
│   ├── nginx.conf                    # Nginx config for production
│   ├── package.json
│   ├── vite.config.js
│   └── README.md
│
├── server/                           # Backend Node.js application
│   ├── config/
│   │   └── dbConfig.js              # Database connection configuration
│   ├── controllers/                  # Route controllers (business logic)
│   │   ├── cart.controller.js
│   │   ├── contact.controller.js
│   │   ├── employee.controller.js
│   │   ├── expense.controller.js
│   │   ├── giftCard.controller.js
│   │   ├── menuItemController.js
│   │   ├── payment.controller.js
│   │   ├── reservation.controller.js
│   │   └── review.controller.js
│   ├── middleware/                   # Custom middleware
│   │   ├── adminAuth.js              # Admin authentication middleware
│   │   └── auth.js                   # User authentication middleware
│   ├── models/                       # MongoDB models (Mongoose schemas)
│   │   ├── cart.model.js
│   │   ├── config.model.js
│   │   ├── contact.model.js
│   │   ├── employee.model.js
│   │   ├── expense.model.js
│   │   ├── giftCard.model.js
│   │   ├── issuedGiftCard.model.js
│   │   ├── menuItem.model.js
│   │   ├── order.model.js
│   │   ├── reservation.model.js
│   │   ├── review.model.js
│   │   └── user.js
│   ├── routes/                       # API routes
│   │   ├── admin.js
│   │   ├── adminRoute.js
│   │   ├── auth.routes.js
│   │   ├── cart.routes.js
│   │   ├── contact.routes.js
│   │   ├── employee.routes.js
│   │   ├── expense.routes.js
│   │   ├── giftCard.routes.js
│   │   ├── menuItem.routes.js
│   │   ├── payment.routes.js
│   │   ├── reservation.routes.js
│   │   └── review.routes.js
│   ├── tests/                        # Test files
│   │   ├── integration/
│   │   ├── unit/
│   │   ├── utils/
│   │   └── setup.js
│   ├── uploads/                      # Uploaded files directory
│   │   └── readme.md
│   ├── .dockerignore
│   ├── Dockerfile
│   ├── package.json
│   └── server.js                     # Entry point
│
├── .github/
│   └── workflows/
│       └── ci-cd.yml                 # CI/CD pipeline configuration
├── docker-compose.yml                # Docker Compose configuration
├── .gitignore
└── README.md
```

<a id="api-documentation"></a>
## 🔌 API Documentation

### Base URL

```
Development: http://localhost:4000/api
Production: https://your-domain.com/api
```

### Authentication

Most endpoints require authentication via JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Endpoints

**Total Endpoints: 67 endpoints**

**Breakdown by category:**

- **Authentication** (`/api/auth`) - 10 endpoints
- **Menu Items** (`/api/menu`) - 5 endpoints
- **Cart** (`/api/cart`) - 5 endpoints
- **Payments** (`/api/payment`) - 11 endpoints
- **Reservations** (`/api/reservations`) - 9 endpoints
- **Reviews** (`/api/reviews`) - 4 endpoints
- **Contact** (`/api/contact`) - 4 endpoints
- **Gift Cards** (`/api/giftcards`) - 6 endpoints
- **Employees** (`/api/employees`) - 4 endpoints
- **Expenses** (`/api/expenses`) - 3 endpoints
- **Admin - Orders** (`/api/admin/orders`) - 1 endpoint
- **Admin - Users** (`/api/users`) - 4 endpoints
- **Root** (`/`) - 1 endpoint

#### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|--------------|
| GET | `/api/auth/me` | Get current user profile | Yes |
| POST | `/api/auth/signup` | Register a new user | No |
| POST | `/api/auth/login` | User login | No |
| POST | `/api/auth/forgot-password` | Request password reset OTP | No |
| POST | `/api/auth/verify-otp` | Verify OTP for password reset | No |
| POST | `/api/auth/reset-password` | Reset password with OTP | No |
| POST | `/api/auth/account/send-otp` | Send OTP for account updates | Yes |
| POST | `/api/auth/account/verify-otp` | Verify OTP for account updates | Yes |
| PUT | `/api/auth/account/update-email` | Update user email | Yes |
| PUT | `/api/auth/account/update-password` | Update user password | Yes |

#### Menu Items

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/menu` | Get all menu items | No | - |
| GET | `/api/menu/:id` | Get a specific menu item | No | - |
| POST | `/api/menu` | Create a menu item | Yes | Admin |
| PUT | `/api/menu/:id` | Update a menu item | Yes | Admin |
| DELETE | `/api/menu/:id` | Delete a menu item | Yes | Admin |

#### Cart

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart` | Add item to cart | Yes |
| DELETE | `/api/cart/clear` | Clear entire cart | Yes |
| PUT | `/api/cart/:id` | Update cart item quantity | Yes |
| DELETE | `/api/cart/:id` | Remove item from cart | Yes |

#### Payments

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/payment/create-payment-intent` | Create Stripe payment intent | Yes | - |
| POST | `/api/payment/confirm-payment` | Confirm payment and create order | Yes | - |
| GET | `/api/payment/order/:orderId` | Get specific order details | Yes | - |
| GET | `/api/payment/my-orders` | Get user's order history | Yes | - |
| PUT | `/api/payment/order/:orderId/cancel` | Cancel user's order | Yes | - |
| DELETE | `/api/payment/order/:orderId` | Delete order | Yes | - |
| GET | `/api/payment/admin/orders` | Get all orders (with pagination) | Yes | Admin |
| PUT | `/api/payment/admin/orders/:orderId/status` | Update order status | Yes | Admin |
| PUT | `/api/payment/admin/orders/:orderId/accept` | Accept order | Yes | Admin |
| PUT | `/api/payment/admin/orders/:orderId/cancel` | Cancel order (admin) | Yes | Admin |
| GET | `/api/payment/admin/income` | Get monthly income statistics | Yes | Admin |

#### Reservations

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/reservations` | Create a reservation | No | - |
| GET | `/api/reservations/my-reservations` | Get user's reservations | Yes | - |
| GET | `/api/reservations/admin` | Get all reservations | Yes | Admin |
| POST | `/api/reservations/admin` | Create reservation (admin) | Yes | Admin |
| PUT | `/api/reservations/admin/:id` | Update reservation | Yes | Admin |
| DELETE | `/api/reservations/admin/:id` | Delete reservation | Yes | Admin |
| GET | `/api/reservations/stats/daily` | Get daily reservation statistics | Yes | Admin |
| GET | `/api/reservations/config/:key` | Get reservation configuration | Yes | Admin |
| POST | `/api/reservations/config` | Set reservation configuration | Yes | Admin |

#### Reviews

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/reviews/all` | Get all reviews | No | - |
| POST | `/api/reviews/add` | Create a review | No | - |
| PUT | `/api/reviews/:id/read` | Mark review as read | Yes | Admin |
| DELETE | `/api/reviews/:id` | Delete a review | Yes | Admin |

#### Contact

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| POST | `/api/contact` | Submit contact form | No | - |
| GET | `/api/contact` | Get all messages | Yes | Admin |
| PUT | `/api/contact/:id/read` | Mark message as read | Yes | Admin |
| DELETE | `/api/contact/:id` | Delete message | Yes | Admin |

#### Gift Cards

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/giftcards` | Get all gift cards | No | - |
| POST | `/api/giftcards` | Create/purchase a gift card | Yes | Admin |
| PUT | `/api/giftcards/:id` | Update gift card | Yes | Admin |
| DELETE | `/api/giftcards/:id` | Delete gift card | Yes | Admin |
| POST | `/api/giftcards/validate` | Validate gift card | Yes | Admin |
| POST | `/api/giftcards/redeem` | Redeem a gift card | Yes | Admin |

#### Admin Routes

##### Users Management

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/users` | Get all users | Yes | Admin |
| POST | `/api/users/add` | Add new user | Yes | Admin |
| PUT | `/api/users/:id` | Update user (change role) | Yes | Admin |
| DELETE | `/api/users/:id` | Delete user | Yes | Admin |

##### Employees Management

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/employees` | Get all employees | Yes | Admin |
| POST | `/api/employees` | Create employee | Yes | Admin |
| PUT | `/api/employees/:id` | Update employee | Yes | Admin |
| DELETE | `/api/employees/:id` | Delete employee | Yes | Admin |

##### Expenses Management

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/expenses` | Get all expenses | Yes | Admin |
| POST | `/api/expenses` | Create expense | Yes | Admin |
| DELETE | `/api/expenses/:id` | Delete expense | Yes | Admin |

##### Admin Orders

| Method | Endpoint | Description | Auth Required | Role |
|--------|----------|-------------|---------------|------|
| GET | `/api/admin/orders` | Get all orders | Yes | Admin |

#### Root

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Health check endpoint | No |

### Example API Request

```javascript
// Login
const response = await fetch('http://localhost:4000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const data = await response.json();
const token = data.token;

// Get menu items
const menuResponse = await fetch('http://localhost:4000/api/menu', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Create payment intent
const paymentResponse = await fetch('http://localhost:4000/api/payment/create-payment-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    amount: 5000, // Amount in cents
    currency: 'usd'
  })
});
```

<a id="environment-variables"></a>
## 🔐 Environment Variables

### Server Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | No | 4000 |
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `JWT_EXPIRE` | JWT token expiration time | No | 7d |
| `STRIPE_SECRET_KEY` | Stripe secret API key | Yes | - |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable API key | Yes | - |
| `EMAIL_HOST` | SMTP server host | Yes* | - |
| `EMAIL_PORT` | SMTP server port | Yes* | - |
| `EMAIL_USER` | Email address for sending emails | Yes* | - |
| `EMAIL_PASSWORD` | Email app password | Yes* | - |
| `ADMIN_SECRET_KEY` | Secret key for admin account creation | Yes | - |
| `CLIENT_URL` | Frontend URL for CORS | No | http://localhost:5173 |
| `CLIENT_URL_PROD` | Production frontend URL | No | http://localhost:80 |

*Required for password reset functionality

### Client Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | http://localhost:4000 |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes | - |

<a id="docker-deployment"></a>
## 🐳 Docker Deployment

### Prerequisites

- Docker installed ([Get Docker](https://www.docker.com/get-started))
- Docker Compose installed

### Quick Start with Docker

1. **Create Environment File**

   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_app_password
   ADMIN_SECRET_KEY=your_admin_secret_key
   ```

2. **Build and Start Containers**

   ```bash
   docker-compose up --build
   ```

3. **Access the Application**

   - Frontend: `http://localhost:80`
   - Backend API: `http://localhost:4000`

### Docker Commands

```bash
# Build and start containers
docker-compose up --build

# Start containers in detached mode
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f server
docker-compose logs -f client

# Rebuild specific service
docker-compose build server
docker-compose build client

# Stop and remove containers, networks, and volumes
docker-compose down -v

# Execute command in running container
docker-compose exec server npm test
```

### Docker Architecture

- **Server Container**: Node.js backend running on port 4000
- **Client Container**: Nginx serving React build on port 80
- **Network**: Bridge network for container communication
- **Volumes**: Persistent storage for uploads directory

<a id="deployment"></a>
## 🚀 Deployment

### Production Deployment Checklist

- [ ] Set up production MongoDB (Atlas recommended)
- [ ] Configure production environment variables
- [ ] Use production Stripe keys
- [ ] Set up HTTPS/SSL certificates
- [ ] Configure production CORS settings
- [ ] Set up production email service
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up CI/CD pipeline
- [ ] Test all functionality in staging environment

### Deployment Options

#### Option 1: Docker Compose (Recommended)

Deploy using Docker Compose on a VPS or cloud provider:

```bash
# Clone repository
git clone <repository-url>
cd coursework-group-29

# Set up environment variables
cp .env.example .env
# Edit .env with production values

# Build and start
docker-compose up -d --build
```

#### Option 2: Traditional Deployment

1. **Backend Deployment**
   ```bash
   cd server
   npm install --production
   npm start
   ```

2. **Frontend Deployment**
   ```bash
   cd client
   npm install
   npm run build
   # Serve dist/ folder with Nginx or similar
   ```

#### Option 3: Cloud Platforms

- **Heroku**: Use Heroku Postgres and deploy both services
- **AWS**: Use EC2, ECS, or Elastic Beanstalk
- **DigitalOcean**: Use App Platform or Droplets
- **Vercel/Netlify**: Frontend on Vercel/Netlify, backend on Railway/Render

<a id="security"></a>
## 🔒 Security

### Implemented Security Measures

1. **Authentication & Authorization**
   - JWT-based authentication
   - Password hashing with bcryptjs
   - Role-based access control (RBAC)
   - Protected routes on both frontend and backend

2. **Password Security**
   - Passwords are hashed before storage
   - OTP-based password reset
   - Email verification for account updates

3. **API Security**
   - CORS configuration
   - Input validation
   - SQL injection prevention (MongoDB NoSQL)
   - XSS protection (React's built-in escaping)

4. **Payment Security**
   - Stripe integration (PCI DSS compliant)
   - Payment intents for secure transactions
   - No sensitive payment data stored locally

5. **File Upload Security**
   - File type validation
   - File size limits
   - Secure file storage

### Security Best Practices

- ✅ Never commit `.env` files
- ✅ Use strong JWT secrets (minimum 32 characters)
- ✅ Use HTTPS in production
- ✅ Regularly update dependencies
- ✅ Implement rate limiting (recommended for production)
- ✅ Use environment-specific configurations
- ✅ Validate all user inputs
- ✅ Sanitize file uploads
- ✅ Keep dependencies up to date
- ✅ Use secure headers (helmet.js recommended)

### Security Recommendations for Production

1. **Rate Limiting**: Implement rate limiting using `express-rate-limit`
2. **Helmet.js**: Use Helmet.js for security headers
3. **Input Validation**: Use libraries like `joi` or `express-validator`
4. **Logging**: Implement comprehensive logging with Winston or similar
5. **Monitoring**: Set up error tracking (Sentry, Rollbar)
6. **Backup**: Regular database backups
7. **SSL/TLS**: Always use HTTPS in production

<a id="performance"></a>
## ⚡ Performance

### Optimization Strategies

1. **Frontend**
   - Code splitting with React.lazy()
   - Image optimization
   - Lazy loading components
   - Memoization for expensive computations
   - Bundle size optimization

2. **Backend**
   - Database indexing
   - Query optimization
   - Caching strategies
   - Connection pooling
   - Async/await for non-blocking operations

3. **Database**
   - Proper indexing on frequently queried fields
   - Query optimization
   - Connection pooling
   - Regular database maintenance

### Performance Monitoring

- Use tools like Lighthouse for frontend performance
- Monitor API response times
- Track database query performance
- Monitor server resources (CPU, memory)

<a id="browser-support"></a>
## 🌐 Browser Support

The application supports all modern browsers:

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

**Minimum Requirements:**
- ES6+ support
- LocalStorage support
- Fetch API support

<a id="troubleshooting"></a>
## 🐛 Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Problem**: `DATABASE ERROR: Connection failed`

**Solutions**:
- Verify MongoDB is running
- Check `MONGODB_URI` in `.env` file
- Ensure MongoDB Atlas IP whitelist includes your IP
- Verify network connectivity
- Check MongoDB connection string format

#### 2. Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::4000`

**Solutions**:
```bash
# Find and kill process using port 4000
# macOS/Linux
lsof -ti:4000 | xargs kill -9

# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# Or change PORT in .env file
```

#### 3. CORS Errors

**Problem**: `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solutions**:
- Verify `CLIENT_URL` in server `.env` matches frontend URL
- Check CORS configuration in `server.js`
- Ensure credentials are included in requests
- Verify allowed origins list

#### 4. Stripe Payment Errors

**Problem**: Payment fails or Stripe errors

**Solutions**:
- Verify Stripe keys are correct (test vs live)
- Check Stripe dashboard for error logs
- Ensure payment intent is created before confirmation
- Verify webhook endpoints (if configured)
- Check Stripe API version compatibility

#### 5. Email Not Sending

**Problem**: Password reset emails not received

**Solutions**:
- Verify email credentials in `.env`
- For Gmail, use App Password, not regular password
- Check email service provider settings
- Verify SMTP port and host
- Check spam folder
- Verify email service account is not locked

#### 6. Build Errors

**Problem**: Frontend build fails

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite
rm -rf dist

# Check for TypeScript/ESLint errors
npm run lint
```

#### 7. Docker Issues

**Problem**: Containers won't start

**Solutions**:
```bash
# Check Docker is running
docker ps

# View container logs
docker-compose logs

# Rebuild containers
docker-compose down
docker-compose up --build

# Check environment variables
docker-compose config
```

#### 8. Module Not Found Errors

**Problem**: `Cannot find module` errors

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

### Getting Help

If you encounter issues not listed here:

1. Check the [Issues](../../issues) page
2. Review server logs for error messages
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly
5. Ensure all dependencies are installed
6. Check MongoDB connection and status
7. Verify Stripe account and keys



<a id="license"></a>
## 📝 License

This project is licensed under the ISC License.

<a id="authors"></a>
## 👥 Authors

- **Development Team** - Year 3 Semester 1 Full-Stack Development

<a id="acknowledgments"></a>
## 🙏 Acknowledgments

- **MongoDB** - Database services
- **Stripe** - Payment processing infrastructure
- **React & Express Communities** - Excellent documentation and support
- **Open Source Contributors** - For the amazing libraries and tools
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework

<a id="support"></a>
## 📞 Support

For support, email support@hotgrill.com or open an issue in the repository.

---