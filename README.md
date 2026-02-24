# EcoLife - Sustainable Living Platform

EcoLife is a comprehensive full-stack application designed to promote sustainable living through energy tracking, waste management, recycling, and a marketplace for eco-friendly items.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [MongoDB Database Setup](#mongodb-database-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Endpoint Documentation](#api-endpoint-documentation)

---

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Firebase Admin SDK** - File storage
- **bcryptjs** - Password hashing
- **Multer** - File upload handling

### Frontend
- **React 19** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)
- **Firebase Project** - For file storage (optional but recommended)

---

## Project Structure

```
EcoLife/
│
├── server/                 # Node.js backend application
│   ├── config/            # Configuration files (DB, Firebase)
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── index.js           # Server entry point
│   └── package.json
│
└── ReadMe.md              # This file
```

---

## Backend Setup

### Step 1: Navigate to Server Directory

```bash
cd server
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- firebase-admin
- multer

### Step 3: Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/ecolife

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# Firebase Configuration (for file uploads)
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

**Important:** Replace all placeholder values with your actual credentials.

### Step 4: Verify Setup

The backend server should start without errors. The server will:
- Connect to MongoDB
- Initialize Firebase Admin SDK
- Start listening on the specified port (default: 5000)

---

## Frontend Setup

### Step 1: Navigate to Client Directory

```bash
cd client
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- vite
- lucide-react
- react-icons

### Step 3: Environment Variables (Optional)

If your backend runs on a different URL, create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
```

### Step 4: Verify Setup

The frontend development server should start and be accessible at `http://localhost:5173`.

---

## MongoDB Database Setup

### Option 1: Local MongoDB Installation

#### Windows:
1. Download MongoDB Community Server from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Run the installer and follow the setup wizard
3. MongoDB will be installed as a Windows service and start automatically
4. Default connection string: `mongodb://localhost:27017`

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux:
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and update `MONGO_URI` in `.env`:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ecolife?retryWrites=true&w=majority
```

### Step 3: Verify MongoDB Connection

The backend will automatically connect to MongoDB when it starts. You should see:
```
MongoDB Connected: localhost:27017
```

If you encounter connection errors:
- Ensure MongoDB is running: `mongod` (or check service status)
- Verify the `MONGO_URI` in your `.env` file
- Check MongoDB logs for errors

---

## Environment Variables

### Backend (.env in `server/` directory)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | `5000` |
| `NODE_ENV` | Environment mode | No | `development` |
| `MONGO_URI` | MongoDB connection string | **Yes** | `mongodb://localhost:27017/ecolife` |
| `JWT_SECRET` | Secret key for JWT tokens | **Yes** | `your_secret_key_here` |
| `FIREBASE_PROJECT_ID` | Firebase project ID | No* | `your-project-id` |
| `FIREBASE_PRIVATE_KEY` | Firebase private key | No* | `-----BEGIN PRIVATE KEY-----\n...` |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email | No* | `service@project.iam.gserviceaccount.com` |
| `FIREBASE_STORAGE_BUCKET` | Firebase storage bucket | No* | `project.appspot.com` |
| `CLIENT_URL` | Frontend URL for CORS | No | `http://localhost:5173` |

*Firebase variables are optional but required for file upload functionality.

### Frontend (.env in `client/` directory - Optional)

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | No | `http://localhost:5000` |

---

## Running the Application

### Development Mode

#### Terminal 1 - Backend Server:
```bash
cd server
npm run dev
```

The server will start with nodemon (auto-reload on changes) and run on `http://localhost:5000`

#### Terminal 2 - Frontend Client:
```bash
cd client
npm run dev
```

The frontend will start and be accessible at `http://localhost:5173`

### Production Mode

#### Backend:
```bash
cd server
npm start
```

#### Frontend:
```bash
cd client
npm run build
npm run preview
```

---

## API Endpoint Documentation

**Base URL:** `http://localhost:5000/api`

All authenticated endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication API

**Base URL:** `/api/auth`

### Register User

**POST** `/register`

Register a new regular user account.

**Request Body:**
```json
{
  "name": "Vihanga Perera",
  "email": "vihanga@example.com",
  "password": "12345678"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Registration successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWQ2NmYwMTJkZDg0NmU0ODU5NDJjZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzcxOTIzMTg1LCJleHAiOjE3NzQ1MTUxODV9.evOJ2fl6JemqQpt35nmiBdmtwcZstKvdbW0dLy_iScU",
    "user": {
        "_id": "699d66f012dd846e485942cd",
        "name": "Vihanga Perera",
        "email": "vihanga@example.com",
        "role": "user",
        "greenScore": 0,
        "profileImage": ""
    }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "User already exists"
}
```

---

### Register Admin

**POST** `/register-admin`

Register a new admin account.

**Request Body:**
```json
{
  "name": "Admin User",
  "email": "admin@ecolife.com",
  "password": "admin123456"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Admin registration successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWQ2OWIwMTJkZDg0NmU0ODU5NDJkMCIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3MTkyMzg4OCwiZXhwIjoxNzc0NTE1ODg4fQ.WmfM5D1P233W6BhWbnnw7UT4Y6moBWkjGdL3okUXXBI",
    "user": {
        "_id": "699d69b012dd846e485942d0",
        "name": "Admin User",
        "email": "admin@ecolife.com",
        "role": "admin",
        "greenScore": 0,
        "profileImage": ""
    }
}
```

---

### Login

**POST** `/login`

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "vihanga@example.com",
  "password": "12345678"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Login successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWQ2NmYwMTJkZDg0NmU0ODU5NDJjZCIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzcxOTIzOTg1LCJleHAiOjE3NzQ1MTU5ODV9.dD6YNgIrWNzEByFM5Vj3XGNtmxBemapmDgskaYzzptM",
    "user": {
        "_id": "699d66f012dd846e485942cd",
        "name": "Vihanga Perera",
        "email": "vihanga@example.com",
        "role": "user",
        "greenScore": 0,
        "profileImage": ""
    }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Get My Profile

**GET** `/me`

**Authentication:** Required

Get the authenticated user's profile.

**Response (200 OK):**
```json
{
    "success": true,
    "user": {
        "_id": "699d66f012dd846e485942cd",
        "name": "Vihanga Perera",
        "email": "vihanga@example.com",
        "role": "user",
        "greenScore": 0,
        "totalTransactions": 0,
        "profileImage": "",
        "isActive": true,
        "createdAt": "2026-02-24T08:53:04.795Z",
        "__v": 0
    }
}
```

---

### Update Profile

**PUT** `/me`

**Authentication:** Required

Update the authenticated user's profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "profileImage": "https://example.com/image.jpg"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Profile updated",
    "user": {
        "_id": "699d66f012dd846e485942cd",
        "name": "Updated Name",
        "email": "vihanga@example.com",
        "role": "user",
        "greenScore": 0,
        "totalTransactions": 0,
        "profileImage": "https://example.com/image.jpg",
        "isActive": true,
        "createdAt": "2026-02-24T08:53:04.795Z",
        "__v": 0
    }
}
```

---

## Energy API

**Base URL:** `/api/energy`

### Add Appliance

**POST** `/appliances`

**Authentication:** Required

Add a new appliance to track energy consumption.

**Request Body:**
```json
{
  "name": "Refrigerator",
  "wattage": 150,
  "category": "Kitchen"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Appliance added",
    "appliance": {
        "userId": "699d66f012dd846e485942cd",
        "name": "Refrigerator",
        "wattage": 150,
        "category": "Kitchen",
        "status": "off",
        "totalKwhThisMonth": 0,
        "_id": "699d6b4e12dd846e485942d8",
        "usageSessions": [],
        "createdAt": "2026-02-24T09:11:42.598Z",
        "__v": 0
    }
}
```

---

### Get My Appliances

**GET** `/appliances`

**Authentication:** Required

Get all appliances for the authenticated user.

**Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "appliances": [
        {
            "_id": "699d6b4e12dd846e485942d8",
            "userId": "699d66f012dd846e485942cd",
            "name": "Refrigerator",
            "wattage": 150,
            "category": "Kitchen",
            "status": "off",
            "totalKwhThisMonth": 0,
            "usageSessions": [],
            "createdAt": "2026-02-24T09:11:42.598Z",
            "__v": 0
        }
    ]
}
```

---

### Update Appliance

**PUT** `/appliances/:id`

**Authentication:** Required

Update an existing appliance.

**Request Body:**
```json
{
  "name": "TV",
  "wattage": 200,
  "category": "Living"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Appliance updated",
    "appliance": {
        "_id": "699d6b4e12dd846e485942d8",
        "userId": "699d66f012dd846e485942cd",
        "name": "TV",
        "wattage": 200,
        "category": "Living",
        "status": "off",
        "totalKwhThisMonth": 0,
        "usageSessions": [],
        "createdAt": "2026-02-24T09:11:42.598Z",
        "__v": 0
    }
}
```

---

### Delete Appliance

**DELETE** `/appliances/:id`

**Authentication:** Required

Delete an appliance.

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Appliance deleted"
}
```

---

### Toggle Appliance ON/OFF

**PATCH** `/appliances/:id/toggle`

**Authentication:** Required

Toggle appliance power state.

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Appliance turned on",
    "appliance": {
        "_id": "699d6dc412dd846e485942ee",
        "userId": "699d66f012dd846e485942cd",
        "name": "Refrigerator",
        "wattage": 150,
        "category": "Kitchen",
        "status": "on",
        "totalKwhThisMonth": 0.0004,
        "usageSessions": [
            {
                "startTime": "2026-02-24T09:23:03.021Z",
                "endTime": "2026-02-24T09:23:13.151Z",
                "kwhUsed": 0.0004,
                "_id": "699d6e0112dd846e485942f5"
            }
        ],
        "createdAt": "2026-02-24T09:22:12.638Z",
        "__v": 1,
        "lastStartTime": "2026-02-24T09:23:23.705Z"
    }
}
```

---

### Estimate Bill

**GET** `/estimate-bill`

**Authentication:** Required

Get estimated energy bill based on appliances and tariffs.

**Response (200 OK):**
```json
{
    "success": true,
    "totalKwh": 0,
    "estimatedBill": 0,
    "appliances": 2,
    "tariffApplied": "No matching tariff"
}
```

---

### Create Tariff (Admin Only)

**POST** `/tariffs`

**Authentication:** Required (Admin)

Create a new energy tariff block.

**Request Body:**
```json
{
  "blockName": "Block 1",
  "minUnits": 0,
  "maxUnits": 100,
  "unitRate": 5.50,
  "fixedCharge": 100,
  "isActive": true
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Tariff created",
    "tariff": {
        "blockName": "Block 1",
        "minUnits": 0,
        "maxUnits": 100,
        "unitRate": 5.5,
        "fixedCharge": 100,
        "isActive": true,
        "_id": "699d700512dd846e48594302",
        "updatedAt": "2026-02-24T09:31:49.356Z",
        "__v": 0
    }
}
```

---

### Get All Tariffs

**GET** `/tariffs`

**Authentication:** Not Required

Get all active tariffs.

**Response (200 OK):**
```json
{
    "success": true,
    "tariffs": [
        {
            "_id": "699d700512dd846e48594302",
            "blockName": "Block 1",
            "minUnits": 0,
            "maxUnits": 100,
            "unitRate": 5.5,
            "fixedCharge": 100,
            "isActive": true,
            "updatedAt": "2026-02-24T09:31:49.356Z",
            "__v": 0
        }
    ]
}
```

---

### Update Tariff (Admin Only)

**PUT** `/tariffs/:id`

**Authentication:** Required (Admin)

Update an existing tariff.

**Request Body:**
```json
{
  "blockName": "Updated Block",
  "unitRate": 6.00,
  "fixedCharge": 120
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Tariff updated",
    "tariff": {
        "_id": "699d700512dd846e48594302",
        "blockName": "Updated Block",
        "minUnits": 0,
        "maxUnits": 100,
        "unitRate": 6,
        "fixedCharge": 120,
        "isActive": true,
        "updatedAt": "2026-02-24T09:33:26.946Z",
        "__v": 0
    }
}
```

---

### Delete Tariff (Admin Only)

**DELETE** `/tariffs/:id`

**Authentication:** Required (Admin)

Delete a tariff.

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Tariff deleted"
}
```

---
