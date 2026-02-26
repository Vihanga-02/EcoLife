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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWQ2********",
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY******************",
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
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5OWQ2***************",
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
## Energy API

**Base URL:** `/api/energy`

### Add Appliance

**POST** `/appliances`

**Authentication:** Required

Add a new appliance to track energy consumption and estimate monthly usage.

**Request Body:**
```json
{
  "name": "Refrigerator",
  "wattage": 150,
  "category": "Kitchen",
  "noOfHoursForDay": 8,
  "noOfDaysForMonth": 30
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Appliance added",
    "appliance": {
        "userId": "699ed8acc9c95125e883ac8f",
        "name": "Refrigerator",
        "wattage": 150,
        "noOfHoursForDay": 8,
        "noOfDaysForMonth": 30,
        "category": "Kitchen",
        "status": "off",
        "totalKwhThisMonth": 0,
        "_id": "699f4e0dfb7519c9609c5697",
        "usageSessions": [],
        "createdAt": "2026-02-25T19:31:25.466Z",
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
  "appliances": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Refrigerator",
      "wattage": 150,
      "noOfHoursForDay": 8,
      "noOfDaysForMonth": 30,
      "category": "Kitchen",
      "status": "off",
      "userId": "507f1f77bcf86cd799439012",
      "createdAt": "2026-02-25T00:00:00.000Z"
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
  "noOfHoursForDay": 5,
  "noOfDaysForMonth": 30
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Appliance updated",
    "appliance": {
        "_id": "699f4bd403fa31a199a3028a",
        "userId": "699ed8acc9c95125e883ac8f",
        "name": "LED TV",
        "wattage": 50,
        "noOfHoursForDay": 5,
        "noOfDaysForMonth": 30,
        "category": "Living",
        "status": "off",
        "totalKwhThisMonth": 0,
        "usageSessions": [],
        "createdAt": "2026-02-25T19:21:56.834Z",
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

Toggle appliance power state. When turning **off**, the API records a usage session and updates `totalKwhThisMonth` for real-time bill calculations.

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Appliance turned on",
    "appliance": {
        "_id": "699f4bf103fa31a199a3028d",
        "userId": "699ed8acc9c95125e883ac8f",
        "name": "Washing Machine",
        "wattage": 200,
        "noOfHoursForDay": 2,
        "noOfDaysForMonth": 5,
        "category": "Other",
        "status": "on",
        "totalKwhThisMonth": 0,
        "usageSessions": [],
        "createdAt": "2026-02-25T19:22:25.586Z",
        "__v": 0,
        "lastStartTime": "2026-02-25T19:25:49.678Z"
    }
}
```

---

### Get Real-Time Bill

**GET** `/real-time-bill`

**Authentication:** Required

Get the **real-time** energy bill based on actual tracked usage (`totalKwhThisMonth`) from appliance toggle sessions and current tariffs.

**Response (200 OK):**
```json
{
  "success": true,
  "totalKwh": 150.5,
  "realTimeBill": 827.75,
  "appliances": 3,
  "tariffApplied": "Block 1"
}
```

---

### Estimate Monthly Bill (Using Hours/Days Per Appliance)

**GET** `/estimate-bill`

**Authentication:** Required

Estimate the **monthly** energy usage and bill based on each appliance's `wattage`, `noOfHoursForDay`, and `noOfDaysForMonth`, combined with the active tariff blocks.

**Response (200 OK):**
```json
{
    "success": true,
    "totalEstimatedKwh": 38,
    "totalEstimatedBill": 523,
    "appliances": [
        {
            "applianceId": "699f4bf103fa31a199a3028d",
            "name": "Washing Machine",
            "wattage": 200,
            "noOfHoursForDay": 2,
            "noOfDaysForMonth": 5,
            "estimatedKwhPerMonth": 2,
            "estimatedCostPerMonth": 27.53
        },
        {
            "applianceId": "699f4e0dfb7519c9609c5697",
            "name": "Refrigerator",
            "wattage": 150,
            "noOfHoursForDay": 8,
            "noOfDaysForMonth": 30,
            "estimatedKwhPerMonth": 36,
            "estimatedCostPerMonth": 495.47
        }
    ],
    "tariffApplied": "Block 2",
    "effectiveUnitRate": 13.7632
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
  "maxUnits": 30,
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
    "_id": "507f1f77bcf86cd799439011",
    "blockName": "Block 1",
    "minUnits": 0,
    "maxUnits": 30,
    "unitRate": 5.5,
    "fixedCharge": 100,
    "isActive": true
  }
}
```

---

### Get All Tariffs

**GET** `/tariffs`

**Authentication:** Required

Get all active tariffs.

**Response (200 OK):**
```json
{
  "success": true,
  "tariffs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "blockName": "Block 1",
      "minUnits": 0,
      "maxUnits": 30,
      "unitRate": 5.5,
      "fixedCharge": 100,
      "isActive": true
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
    "_id": "507f1f77bcf86cd799439011",
    "blockName": "Updated Block",
    "unitRate": 6.00,
    "fixedCharge": 120
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
  "message": "Tariff deleted successfully"
}
```

## Waste Management API

**Base URL:** `/api/waste`

### Log Waste

**POST** `/`

**Authentication:** Required

Create a new waste log entry.

**Request Body:**
```json
{
  "wasteType": "Plastic",
  "quantity": 5,
  "unit": "kg",
  "notes": "Plastic bottles",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Waste Types:** `Plastic`, `Paper`, `Glass`, `Organic`, `E-waste`

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Waste logged successfully",
    "log": {
        "userId": "699d66f012dd846e485942cd",
        "wasteType": "Plastic",
        "quantity": 5,
        "unit": "kg",
        "imageUrl": "https://example.com/image.jpg",
        "isBiodegradable": false,
        "isRecyclable": true,
        "carbonEquivalent": 10,
        "notes": "Plastic bottles",
        "_id": "699d812912dd846e48594353",
        "date": "2026-02-24T10:44:57.381Z",
        "__v": 0
    }
}
```

---

### Get My Waste Logs

**GET** `/`

**Authentication:** Required

Get all waste logs for the authenticated user with optional filters.

**Query Parameters:**
- `wasteType` - Filter by waste type
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Example:** `/waste?wasteType=Plastic&startDate=2024-01-01&endDate=2024-12-31&page=1&limit=20`

**Response (200 OK):**
```json
{
    "success": true,
    "total": 1,
    "logs": [
        {
            "_id": "699d812912dd846e48594353",
            "userId": "699d66f012dd846e485942cd",
            "wasteType": "Plastic",
            "quantity": 5,
            "unit": "kg",
            "imageUrl": "https://example.com/image.jpg",
            "isBiodegradable": false,
            "isRecyclable": true,
            "carbonEquivalent": 10,
            "notes": "Plastic bottles",
            "date": "2026-02-24T10:44:57.381Z",
            "__v": 0
        }
    ]
}
```

---

### Get Waste Analytics

**GET** `/analytics`

**Authentication:** Required

Get waste analytics and statistics for the authenticated user.

**Response (200 OK):**
```json
{
    "success": true,
    "totalLogs": 1,
    "totalByType": {
        "Plastic": 5
    },
    "totalCarbonEquivalent": 10,
    "recyclableItems": 1,
    "biodegradableItems": 0
}
```

---

### Get Waste Log by ID

**GET** `/:id`

**Authentication:** Required

Get a specific waste log by ID.

**Response (200 OK):**
```json
{
    "success": true,
    "log": {
        "_id": "699d812912dd846e48594353",
        "userId": "699d66f012dd846e485942cd",
        "wasteType": "Plastic",
        "quantity": 5,
        "unit": "kg",
        "imageUrl": "https://example.com/image.jpg",
        "isBiodegradable": false,
        "isRecyclable": true,
        "carbonEquivalent": 10,
        "notes": "Plastic bottles",
        "date": "2026-02-24T10:44:57.381Z",
        "__v": 0
    }
}
```

---

### Delete Waste Log

**DELETE** `/:id`

**Authentication:** Required

Delete a waste log entry.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Waste log deleted successfully"
}
```

---

### Get All Waste Logs (Admin Only)

**GET** `/admin/all`

**Authentication:** Required (Admin)

Get all waste logs from all users (admin view).

**Response (200 OK):**
```json
{
  "success": true,
  "wasteLogs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "wasteType": "Plastic",
      "quantity": 5,
      "user": {
        "_id": "507f1f77bcf86cd799439012",
        "name": "Nadee perera"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```
## Marketplace API

**Base URL:** `/api/marketplace`

### Create Item

**POST** `/items`

**Authentication:** Required

Create a new marketplace item listing.

**Request Body:**
```json
{
  "title": "Vintage Bicycle",
  "description": "Eco-friendly transportation option",
  "category": "Transportation",
  "condition": "Good",
  "listingType": "Free",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Note:** `listingType` can be `"sell"` or `"giveaway"`

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Item listed successfully",
    "item": {
        "ownerId": "699d66f012dd846e485942cd",
        "title": "Vintage Bicycle",
        "description": "Eco-friendly transportation option",
        "category": "Transportation",
        "imageUrl": "https://example.com/image.jpg",
        "condition": "Good",
        "listingType": "Free",
        "status": "available",
        "claimedBy": null,
        "_id": "699d719012dd846e48594313",
        "createdAt": "2026-02-24T09:38:24.601Z",
        "updatedAt": "2026-02-24T09:38:24.601Z",
        "__v": 0
    }
}
```

---

### Get All Items

**GET** `/items`

**Authentication:** Not Required

Get all marketplace items with optional filters.

**Query Parameters:**
- `category` - Filter by category
- `condition` - Filter by condition
- `listingType` - Filter by listing type (`sell` or `free`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)

**Example:** `/items?category=Transportation&condition=Good&listingType=sell&page=1&limit=12`

**Response (200 OK):**
```json
{
    "success": true,
    "total": 3,
    "page": 1,
    "pages": 1,
    "items": [
        {
            "_id": "699d719012dd846e48594313",
            "ownerId": {
                "_id": "699d66f012dd846e485942cd",
                "name": "Updated Name",
                "greenScore": 0,
                "profileImage": "https://example.com/image.jpg"
            },
            "title": "Vintage Bicycle",
            "description": "Eco-friendly transportation option",
            "category": "Transportation",
            "imageUrl": "https://example.com/image.jpg",
            "condition": "Good",
            "listingType": "Free",
            "status": "available",
            "claimedBy": null,
            "createdAt": "2026-02-24T09:38:24.601Z",
            "updatedAt": "2026-02-24T09:38:24.601Z",
            "__v": 0
        },
        {
            "_id": "69971b7b044515fc60b9e50d",
            "ownerId": {
                "_id": "699357b66d6c6833606542d9",
                "name": "Amaya",
                "greenScore": 4,
                "profileImage": ""
            },
            "title": "Old Textbooks",
            "description": "Used school books in good condition",
            "category": "Books",
            "imageUrl": "/images/sofa.jpg",
            "condition": "Good",
            "listingType": "Free",
            "status": "available",
            "claimedBy": null,
            "createdAt": "2026-02-19T14:17:31.900Z",
            "updatedAt": "2026-02-19T14:17:31.900Z",
            "__v": 0
        },
        {
            "_id": "699596cebaf900f94b2f2e87",
            "ownerId": {
                "_id": "699357b66d6c6833606542d9",
                "name": "Amaya",
                "greenScore": 4,
                "profileImage": ""
            },
            "title": "Old Textbooks",
            "description": "Used school books in good condition",
            "category": "Books",
            "imageUrl": "https://example.com/book.jpg",
            "condition": "Good",
            "listingType": "Free",
            "status": "available",
            "claimedBy": null,
            "createdAt": "2026-02-18T10:39:10.653Z",
            "updatedAt": "2026-02-18T10:39:10.653Z",
            "__v": 0
        }
    ]
}
```

---

### Get Item by ID

**GET** `/items/:id`

**Authentication:** Not Required

Get a specific item by ID.

**Response (200 OK):**
```json
{
    "success": true,
    "item": {
        "_id": "699d719012dd846e48594313",
        "ownerId": {
            "_id": "699d66f012dd846e485942cd",
            "name": "Updated Name",
            "email": "vihanga@example.com",
            "greenScore": 0,
            "profileImage": "https://example.com/image.jpg"
        },
        "title": "Vintage Bicycle",
        "description": "Eco-friendly transportation option",
        "category": "Transportation",
        "imageUrl": "https://example.com/image.jpg",
        "condition": "Good",
        "listingType": "Free",
        "status": "available",
        "claimedBy": null,
        "createdAt": "2026-02-24T09:38:24.601Z",
        "updatedAt": "2026-02-24T09:38:24.601Z",
        "__v": 0
    }
}
```

---

### Get My Items

**GET** `/my-items`

**Authentication:** Required

Get all items listed by the authenticated user.

**Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "items": [
        {
            "_id": "699d719012dd846e48594313",
            "ownerId": "699d66f012dd846e485942cd",
            "title": "Vintage Bicycle",
            "description": "Eco-friendly transportation option",
            "category": "Transportation",
            "imageUrl": "https://example.com/image.jpg",
            "condition": "Good",
            "listingType": "Free",
            "status": "available",
            "claimedBy": null,
            "createdAt": "2026-02-24T09:38:24.601Z",
            "updatedAt": "2026-02-24T09:38:24.601Z",
            "__v": 0
        }
    ]
}
```

---

### Update Item

**PUT** `/items/:id`

**Authentication:** Required

Update an item (only by the seller).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "condition": "New"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Item updated",
    "item": {
        "_id": "699d719012dd846e48594313",
        "ownerId": "699d66f012dd846e485942cd",
        "title": "Updated Title",
        "description": "Updated description",
        "category": "Transportation",
        "imageUrl": "https://example.com/image.jpg",
        "condition": "New",
        "listingType": "Free",
        "status": "available",
        "claimedBy": null,
        "createdAt": "2026-02-24T09:38:24.601Z",
        "updatedAt": "2026-02-24T09:47:20.231Z",
        "__v": 0
    }
}
```

---

### Delete Item

**DELETE** `/items/:id`

**Authentication:** Required

Delete an item (only by the seller).

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Item deleted"
}
```

---

### Claim Item

**POST** `/items/:id/claim`

**Authentication:** Required

Claim a giveaway item or express interest in a sell item.

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Claim request sent",
    "transaction": {
        "itemId": "699596cebaf900f94b2f2e87",
        "sellerId": "699357b66d6c6833606542d9",
        "buyerId": "699d66f012dd846e485942cd",
        "status": "pending",
        "completedAt": null,
        "_id": "699d740e12dd846e48594330",
        "createdAt": "2026-02-24T09:49:02.155Z",
        "__v": 0
    }
}
```

---

### Get My Transactions

**GET** `/transactions`

**Authentication:** Required

Get all transactions for the authenticated user (as buyer or seller).

**Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "transactions": [
        {
            "_id": "699d740e12dd846e48594330",
            "itemId": {
                "_id": "699596cebaf900f94b2f2e87",
                "title": "Old Textbooks",
                "category": "Books",
                "imageUrl": "https://example.com/book.jpg"
            },
            "sellerId": {
                "_id": "699357b66d6c6833606542d9",
                "name": "Amaya",
                "email": "testuser@gmail.com"
            },
            "buyerId": {
                "_id": "699d66f012dd846e485942cd",
                "name": "Updated Name",
                "email": "vihanga@example.com"
            },
            "status": "pending",
            "completedAt": null,
            "createdAt": "2026-02-24T09:49:02.155Z",
            "__v": 0
        }
    ]
}
```

---

### Review Transaction

**PATCH** `/transactions/:id/review`

**Authentication:** Required

Add a review and rating to a completed transaction.

**Request Body:**
```json
{
  "action":"approve"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Transaction approved",
    "transaction": {
        "_id": "699d740e12dd846e48594330",
        "itemId": "699596cebaf900f94b2f2e87",
        "sellerId": "699357b66d6c6833606542d9",
        "buyerId": "699d66f012dd846e485942cd",
        "status": "completed",
        "completedAt": "2026-02-24T10:17:26.794Z",
        "createdAt": "2026-02-24T09:49:02.155Z",
        "__v": 0
    }
}
```

---

### Get All Items (Admin Only)

**GET** `/admin/all`

**Authentication:** Required (Admin)

Get all marketplace items (admin view).

**Response (200 OK):**
```json
{
  "success": true,
  "items": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Vintage Bicycle",
      "seller": "507f1f77bcf86cd799439012",
      "status": "available"
    }
  ]
}
```


## Recycling API

**Base URL:** `/api/recycling`

### Get All Centers

**GET** `/centers`

**Authentication:** Not Required

Get all recycling centers with optional filters.

**Query Parameters:**
- `city` - Filter by city
- `material` - Filter by accepted material

**Example:** `/centers?city=Mumbai&material=Plastic`

**Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "centers": [
        {
            "location": {
                "type": "Point",
                "coordinates": [
                    79.8612,
                    6.9271
                ]
            },
            "_id": "69959cf0baf900f94b2f2ea0",
            "name": "Colombo Recycling Center",
            "city": "Colombo",
            "address": "No 25, Galle Road, Colombo 03",
            "acceptMaterials": [
                "Plastic",
                "Glass",
                "Paper"
            ],
            "contactNumber": "0771234567",
            "operatingHours": "8:00 AM - 5:00 PM",
            "isActive": true,
            "createdAt": "2026-02-18T11:05:20.868Z",
            "updatedAt": "2026-02-18T11:05:20.869Z",
            "__v": 0
        }
    ]
}
```

---

### Get Nearby Centers

**GET** `/centers/nearby`

**Authentication:** Not Required

Find recycling centers near a specific location.

**Query Parameters:**
- `lng` - Longitude (required)
- `lat` - Latitude (required)
- `maxDist` - Maximum distance in meters (default: 10000)

**Example:** `/centers/nearby?lng=72.8777&lat=19.0760&maxDist=10000`

**Response (200 OK):**
```json
{
  "success": true,
  "centers": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Green Recycling Center",
      "distance": 500,
      "address": "No. 45, Galle Road, Colombo 03",
      "acceptMaterials": ["Plastic", "Paper", "Glass"]
    }
  ]
}
```

---

### Get Center by ID

**GET** `/centers/:id`

**Authentication:** Not Required

Get a specific recycling center by ID.

**Response (200 OK):**
```json
{
    "success": true,
    "center": {
        "location": {
            "type": "Point",
            "coordinates": [
                79.8612,
                6.9271
            ]
        },
        "_id": "69959cf0baf900f94b2f2ea0",
        "name": "Colombo Recycling Center",
        "city": "Colombo",
        "address": "No 25, Galle Road, Colombo 03",
        "acceptMaterials": [
            "Plastic",
            "Glass",
            "Paper"
        ],
        "contactNumber": "0771234567",
        "operatingHours": "8:00 AM - 5:00 PM",
        "isActive": true,
        "createdAt": "2026-02-18T11:05:20.868Z",
        "updatedAt": "2026-02-18T11:05:20.869Z",
        "__v": 0
    }
}
```

---

### Create Center (Admin Only)

**POST** `/centers`

**Authentication:** Required (Admin)

Create a new recycling center.

**Request Body:**
```json
{
  "name": "Green Recycling Center",
  "city": "Colombo",
  "address": "No. 45, Galle Road, Colombo 03",
  "longitude": 72.8777,
  "latitude": 19.0760,
  "acceptMaterials": ["Plastic", "Paper", "Glass"],
  "contactNumber": "+94 11 2345678",
  "operatingHours": "9 AM - 6 PM"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Recycling center created",
    "center": {
        "name": "Green Recycling Center",
        "city": "Colombo",
        "address": "No. 45, Galle Road, Colombo 03",
        "location": {
            "type": "Point",
            "coordinates": [
                72.8777,
                19.076
            ]
        },
        "acceptMaterials": [
            "Plastic",
            "Paper",
            "Glass"
        ],
        "contactNumber": "+94 11 2345678",
        "operatingHours": "9 AM - 6 PM",
        "isActive": true,
        "_id": "699d830112dd846e48594364",
        "createdAt": "2026-02-24T10:52:49.499Z",
        "updatedAt": "2026-02-24T10:52:49.499Z",
        "__v": 0
    }
}
```

---

### Update Center (Admin Only)

**PUT** `/centers/:id`

**Authentication:** Required (Admin)

Update an existing recycling center.

**Request Body:**
```json
{
  "name": "Colombo Recycling Hub",
  "contactNumber": "0771234567",
  "operatingHours": "8 AM - 7 PM"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Center updated",
    "center": {
        "location": {
            "type": "Point",
            "coordinates": [
                72.8777,
                19.076
            ]
        },
        "_id": "699d830112dd846e48594364",
        "name": "Colombo Recycling Hub",
        "city": "Colombo",
        "address": "No. 45, Galle Road, Colombo 03",
        "acceptMaterials": [
            "Plastic",
            "Paper",
            "Glass"
        ],
        "contactNumber": "0771234567",
        "operatingHours": "8 AM - 7 PM",
        "isActive": true,
        "createdAt": "2026-02-24T10:52:49.499Z",
        "updatedAt": "2026-02-24T10:54:45.631Z",
        "__v": 0
    }
}
```

---

### Delete Center (Admin Only)

**DELETE** `/centers/:id`

**Authentication:** Required (Admin)

Delete a recycling center.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Recycling center deleted successfully"
}
```

---

### Create Submission

**POST** `/submissions`

**Authentication:** Required

Create a new recycling submission.

**Request Body:**
```json
{
  "centerId": "699d830112dd846e48594364",
  "materialType": "Plastic",
  "estimatedWeight": 10
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Submission created",
    "submission": {
        "userId": "699d66f012dd846e485942cd",
        "centerId": "699d830112dd846e48594364",
        "materialType": "Plastic",
        "estimatedWeight": 10,
        "unit": "kg",
        "status": "pending",
        "reviewedBy": null,
        "reviewedAt": null,
        "_id": "699d8a3a744351932b771728",
        "submittedAt": "2026-02-24T11:23:38.804Z",
        "__v": 0
    }
}
```

---

### Get My Submissions

**GET** `/submissions/me`

**Authentication:** Required

Get all recycling submissions for the authenticated user.

**Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "submissions": [
        {
            "_id": "699d8a3a744351932b771728",
            "userId": "699d66f012dd846e485942cd",
            "centerId": {
                "_id": "699d830112dd846e48594364",
                "name": "Colombo Recycling Hub",
                "city": "Colombo",
                "address": "No. 45, Galle Road, Colombo 03"
            },
            "materialType": "Plastic",
            "estimatedWeight": 10,
            "unit": "kg",
            "status": "pending",
            "reviewedBy": null,
            "reviewedAt": null,
            "submittedAt": "2026-02-24T11:23:38.804Z",
            "__v": 0
        }
    ]
}
```

---

### Get All Submissions (Admin Only)

**GET** `/submissions`

**Authentication:** Required (Admin)

Get all recycling submissions from all users.

**Response (200 OK):**
```json
{
    "success": true,
    "count": 1,
    "submissions": [
        {
            "_id": "699d8a3a744351932b771728",
            "userId": {
                "_id": "699d66f012dd846e485942cd",
                "name": "Updated Name",
                "email": "vihanga@example.com"
            },
            "centerId": {
                "_id": "699d830112dd846e48594364",
                "name": "Colombo Recycling Hub",
                "city": "Colombo"
            },
            "materialType": "Plastic",
            "estimatedWeight": 10,
            "unit": "kg",
            "status": "pending",
            "reviewedBy": null,
            "reviewedAt": null,
            "submittedAt": "2026-02-24T11:23:38.804Z",
            "__v": 0
        }
    ]
}
```

---

### Review Submission (Admin Only)

**PATCH** `/submissions/:id/review`

**Authentication:** Required (Admin)

Review and approve/reject a recycling submission.

**Request Body:**
```json
{
  "status": "approved",
  "adminNotes": "Submission approved"
}
```

**Status values:** `pending`, `approved`, `rejected`

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Submission approved",
    "submission": {
        "_id": "699d8a3a744351932b771728",
        "userId": "699d66f012dd846e485942cd",
        "centerId": "699d830112dd846e48594364",
        "materialType": "Plastic",
        "estimatedWeight": 10,
        "unit": "kg",
        "status": "approved",
        "reviewedBy": "699d69b012dd846e485942d0",
        "reviewedAt": "2026-02-24T11:27:50.120Z",
        "submittedAt": "2026-02-24T11:23:38.804Z",
        "__v": 0,
        "reviewNotes": ""
    }
}
```

---


## Admin API

**Base URL:** `/api/admin`

**Note:** All endpoints require admin authentication.

### Get Dashboard Stats

**GET** `/stats`

**Authentication:** Required (Admin)

Get dashboard statistics for admin panel.

**Response (200 OK):**
```json
{
  "success": true,
  "stats": {
    "totalUsers": 10,
    "activeUsers": 8,
    "totalWasteLogs": 5,
    "totalRecyclingSubmissions": 10,
    "totalMarketplaceItems": 10,
    "recentActivity": [
      {
        "type": "user_registration",
        "message": "New user registered",
        "timestamp": "2026-02-26T00:00:00.000Z"
      }
    ]
  }
}
```

---

### Get All Users

**GET** `/users`

**Authentication:** Required (Admin)

Get all registered users.

**Response (200 OK):**
```json
{
  "success": true,
  "users": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Pavan Perera",
      "email": "pavan@gmail.com",
      "role": "user",
      "greenScore": 50,
      "isActive": true,
      "createdAt": "2026-02-20T00:00:00.000Z"
    }
  ]
}
```

---

### Get User by ID

**GET** `/users/:id`

**Authentication:** Required (Admin)

Get a specific user by ID.

**Response (200 OK):**
```json
{
  "success": true,
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Pavan Perera",
    "email": "pavan@gmail.com",
    "role": "user",
    "greenScore": 50,
    "isActive": true,
    "profileImage": "https://example.com/image.jpg",
    "createdAt": "2026-02-20T00:00:00.000Z"
  }
}
```

---

### Toggle User Status

**PATCH** `/users/:id/toggle-status`

**Authentication:** Required (Admin)

Activate or deactivate a user account.

**Request Body:**
```json
{
  "isActive": false
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User status updated successfully",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "isActive": false
  }
}
```

---

## Error Responses

All API endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```
or
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied: Admins only"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Server error message"
}
```

---

## Authentication

### How to Use JWT Tokens

1. **Login or Register** to receive a JWT token
2. **Include the token** in the Authorization header for protected routes:
   ```
   Authorization: Bearer <your_jwt_token>
   ```
3. **Token expiration** - Tokens may expire after a certain period. Re-authenticate to get a new token.

### Protected Routes

Most endpoints require authentication. Look for the **Authentication: Required** note in the documentation.

### Admin Routes

Routes marked with **Admin Only** require:
- Valid JWT token
- User role must be `"admin"`
---