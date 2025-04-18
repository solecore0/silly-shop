# SillyShop Backend API Documentation

## Overview

SillyShop is an eCommerce backend API built with modern technologies and best practices.

## Tech Stack

### Core Technologies
- Node.js
- TypeScript
- Express.js
- MongoDB with Mongoose
- Docker

### Key Libraries
- **bcrypt**: Password hashing
- **jsonwebtoken (JWT)**: Authentication
- **multer**: File uploads
- **node-cache**: In-memory caching
- **cors**: Cross-origin resource sharing
- **cookie-parser**: Cookie handling
- **morgan**: HTTP request logging
- **validator**: Data validation
- **dotenv**: Environment variables

## Project Structure

### Root Directory
- `docker-compose.yml`: Docker composition for services
- `Dockerfile`: Container configuration
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript configuration
- `.env`: Environment variables

### Source Code (`/src`)

#### Main Application (`app.ts`)
- Express server setup
- Middleware configuration
- Route mounting
- Database connection

#### Controllers
- `user.ts`: User authentication and management
- `product.ts`: Product CRUD operations
- `order.ts`: Order processing
- `payment.ts`: Payment and coupon handling
- `stats.ts`: Analytics and statistics

#### Models (Mongoose Schemas)
- `user.ts`: User data model
- `product.ts`: Product data model
- `order.ts`: Order data model
- `coupon.ts`: Coupon data model

#### Routes
- Defines API endpoints for each feature
- Implements middleware chains
- Maps routes to controllers

#### Middleware
- `auth.ts`: Authentication and authorization
- `error.ts`: Error handling
- `multer.ts`: File upload handling

#### Utils
- `db.ts`: Database connection
- `features.ts`: Helper functions
- `jwtToken.ts`: Token management
- `utility-class.ts`: Error handling class

## Features

### Authentication
- User registration
- Login with JWT
- Refresh token mechanism
- Role-based authorization (admin/user)

### Product Management
- CRUD operations
- Image upload
- Category management
- Stock tracking
- Search and filtering

### Order System
- Order creation
- Order status management
- Order history
- Stock reduction on purchase

### Payment & Discounts
- Coupon management
- Discount calculations
- Price computations

### Admin Features
- Dashboard statistics
- Sales analytics
- User management
- Product management
- Order management

### Performance Features
- In-memory caching
- Efficient database queries
- File upload optimization

### Security Features
- Password hashing
- JWT authentication
- Protected routes
- Input validation

## API Structure

### Base URL: `/api/v1`

#### User Routes (`/user`)
- `POST /register`: Create new user
- `POST /login`: Authenticate user
- `GET /refresh-token`: Refresh access token
- `GET /logout`: User logout

#### Product Routes (`/product`)
- `GET /find`: Search products
- `POST /new`: Create product
- `GET /categories`: List categories
- `GET /latest`: Get latest products

#### Order Routes (`/order`)
- `POST /new`: Create order
- `GET /my`: User orders
- `GET /all`: All orders (admin)

#### Payment Routes (`/payment`)
- `POST /coupon/new`: Create coupon
- `GET /discount`: Calculate discount

#### Admin Routes (`/admin`)
- `GET /stats/dashboard`: Dashboard data
- `GET /stats/pie`: Pie chart data
- `GET /stats/bar`: Bar chart data
- `GET /stats/line`: Line chart data

## DevOps

### Docker Configuration
- Multi-container setup
- Node.js application container
- MongoDB container
- Volume management
- Environment variable handling

### Development Tools
- TypeScript compilation
- Nodemon for development
- Environment configuration
- Logging system
