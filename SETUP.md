# EcoVolunteer - Full Stack Setup Guide

## Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### 1. Install Dependencies

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### 2. Configure Backend

The backend is pre-configured to use:
- **MongoDB**: mongodb://localhost:27017/ecovoulenteer
- **Port**: 5001
- **JWT Secret**: Pre-configured (change in production)

To use MongoDB Atlas instead, update `backend/.env` (create if needed):
```
MONGODB_URI=your_atlas_connection_string
```

### 3. Seed Database

```bash
cd backend
npm run seed
```

This creates 5 demo users and 7 events.

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on: http://localhost:5173

### 5. Login

Demo accounts (all use password: `password123`):
- **Admin**: priya@example.com
- **Organizer**: rohan@example.com  
- **User**: aisha@example.com

## Project Structure

```
EcoVoulenteer(FRONTEND)/
├── frontend/            # React + Vite frontend
│   ├── src/            # React components, pages, context
│   │   ├── pages/      # React pages
│   │   ├── components/ # React components
│   │   ├── context/    # React context (Auth)
│   │   └── data/       # API calls (axios)
│   ├── public/         # Static assets
│   ├── index.html      # Entry HTML
│   └── package.json    # Frontend dependencies
└── backend/            # Node.js + Express + MongoDB
    ├── models/         # Mongoose schemas
    ├── routes/         # API endpoints
    ├── middleware/     # Auth middleware
    ├── seeders/        # Database seeding
    └── server.js       # Main server
```

## API Endpoints

**Authentication:**
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

**Events:**
- GET /api/events (all approved)
- GET /api/events/pending (admin)
- POST /api/events (create)
- PUT /api/events/:id/approve (admin)
- POST /api/events/:id/join

See [backend/README.md](backend/README.md) for full API documentation.

## Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

**Backend:**
- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod`
- Or use MongoDB Atlas connection string

**Port Already in Use:**
- Backend uses port 5001 (not 5000) to avoid macOS conflicts
- Frontend uses port 5173 (Vite default)

**CORS Errors:**
- Ensure backend is running
- Check API_URL in `src/data/api.js` matches backend port

## Next Steps

- Customize event types and fields
- Add image upload for events
- Implement email notifications
- Add search and filtering
- Deploy to production

Enjoy building with EcoVolunteer! 🌱
