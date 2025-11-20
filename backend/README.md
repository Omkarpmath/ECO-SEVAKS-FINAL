# EcoVolunteer Backend

Backend API for the EcoVolunteer application - a volunteer event management platform for environmental activities.

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` with your MongoDB connection string
   - Update `JWT_SECRET` with a secure random string

4. Seed the database with demo data:
   ```bash
   npm run seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will run on `http://localhost:5000`

## Demo Accounts

After seeding, you can login with:

- **User**: aisha@example.com / password123
- **Organizer**: rohan@example.com / password123
- **Admin**: priya@example.com / password123

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user (protected)

### Events

- `GET /api/events` - Get all approved events (public)
- `GET /api/events/pending` - Get pending events (admin only)
- `GET /api/events/:id` - Get event by ID
- `POST /api/events` - Create new event (protected)
- `GET /api/events/user/:userId/joined` - Get user's joined events
- `GET /api/events/created/:userId` - Get user's created events
- `PUT /api/events/:id/approve` - Approve event (admin only)
- `PUT /api/events/:id/reject` - Reject event (admin only)
- `POST /api/events/:id/join` - Join an event (protected)
- `DELETE /api/events/:id/leave` - Leave an event (protected)

### Users

- `GET /api/users/:id` - Get user by ID

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with demo data

## MongoDB Connection

### Local MongoDB
```
MONGODB_URI=mongodb://localhost:27017/ecovoulenteer
```

### MongoDB Atlas
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecovoulenteer
```

## Security

- JWT tokens expire in 30 days (configurable)
- Passwords are hashed with bcrypt
- Protected routes require valid JWT token
- Role-based authorization for admin/organizer features

## Development

The backend uses nodemon for auto-reload during development. Any changes to the code will automatically restart the server.
