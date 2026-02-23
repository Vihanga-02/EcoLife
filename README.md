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