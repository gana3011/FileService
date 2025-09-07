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

#Redis Configuration
REDIS_URL=your-redis-url

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

### POST `/media/:id/view`
Log a view for a media file with rate limiting (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "message": "View logged successfully"
}
```

### GET `/media/:id/analytics`
Retrieve analytics for a media file (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Response:**
```json
{
  "total_views": 100,
  "unique_ips": 50,
  "views_per_day": {
    "2025-09-01": 10,
    "2025-09-02": 20
  }
}
```

### Error Responses

All endpoints return appropriate HTTP status codes with error messages:

```json
{
  "message": "Error description"
}
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Cleanup Test Data
After running tests, the test user `test@example.com` is automatically deleted from the database.

## 🐳 Docker Support

### Build Docker Image
To build the Docker image for the FileService API, run the following command:
```bash
docker build -t fileservice .
```

### Run Docker Container
To run the Docker container, use:
```bash
docker run -p 3000:3000 --name fileservice-container fileservice
```

### Stop and Remove Container
To stop and remove the container:
```bash
docker stop fileservice-container

docker rm fileservice-container
```

### Notes
- Ensure the `.env` file is properly configured before building the Docker image.
- The `--network=host` option is used to allow the container to access the host's network.

