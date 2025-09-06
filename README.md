# FileService API

A secure Node.js REST API for managing media file uploads and streaming with JWT authentication and PostgreSQL database.

## 🔍 Overview

FileService is a robust backend API designed for secure media file management. It provides authenticated file upload capabilities with automatic storage to Supabase, generates signed URLs for secure streaming, and maintains comprehensive access logs.


## 🛠 Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: PostgreSQL with pg driver
- **File Storage**: Supabase Storage
- **File Upload**: Multer with memory storage


## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd FileService
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

## Environment Configuration
Note : For this task, I already have a database running in supabase, so this step is optional.
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_URL=postgresql://username:password@localhost:5432/database_name

# JWT Configuration
JWT_KEY=your-super-secret-jwt-key

# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SERVICE_ROLE_KEY=your-supabase-service-role-key

# Server Configuration
PORT=3000
```

## Database Setup

The project uses PostgreSQL with the following schema:

### Tables

#### `admin_users`
- Stores authenticated admin user credentials
- Fields: id (UUID), email (unique), hashed_password, created_at

#### `media_assets`
- Stores media file metadata
- Fields: id (UUID), title, type (video/audio), file_url, created_at

#### `media_view_logs`
- Tracks media access for analytics
- Fields: id, media_id (FK), viewed_by_ip, timestamp

Run the provided `database.sql` script to create the required tables:

```bash
psql -d your_database -f database.sql
```

## API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication Endpoints

#### POST `/auth/signup`
Create a new admin user account.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "message": "Sign up successful"
}
```

#### POST `/auth/signin`
Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "securepassword"
}
```

**Response:**
```
JWT:eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Media Endpoints

#### POST `/media`
Upload a media file (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `file`: Media file (video/audio)
- `title`: File title
- `type`: Media type ("video" or "audio")

**Response:**
```json
{
  "id": "uuid",
  "title": "My Video",
  "type": "video",
  "file_url": "storage/path/to/file",
  "created_at": "2025-01-01T00:00:00Z"
}
```

#### GET `/media/:id/stream-url`
Get a signed URL for streaming media (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "url": "https://signed-url-for-streaming"
}
```

### Error Responses

All endpoints return appropriate HTTP status codes with error messages:

```json
{
  "message": "Error description"
}
```


## 📁 Project Structure

```
FileService/
├── src/
│   ├── controller/
│   │   ├── authController.js      # Authentication logic
│   │   └── mediaController.js     # Media management logic
│   ├── middleware/
│   │   ├── check-auth.js          # JWT authentication middleware
│   │   └── request-validation.js  # Input validation middleware
│   └── routes/
│       ├── authRoutes.js          # Authentication routes
│       └── mediaRoutes.js         # Media routes
├── utils/
│   ├── database.js                # PostgreSQL connection setup
│   └── password.js                # Password hashing utilities
├── database.sql                   # Database schema
├── server.js                      # Application entry point
├── package.json                   # Project dependencies
└── README.md                      # Project documentation
```

## 🔧 Development

### Running in Development Mode

```bash
# Install nodemon for auto-restart
npm install -g nodemon

# Start development server
nodemon server.js
```

