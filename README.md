# EcoVolunteer - Full Stack Application

A full-stack volunteer event management platform built with React, Express, and MongoDB.

## 🌱 Project Structure

```
EcoVoulenteer(FRONTEND)/
├── frontend/           # React + Vite frontend application
│   ├── src/           # React components, pages, context
│   ├── public/        # Static assets
│   ├── index.html     # Entry HTML
│   └── package.json   # Frontend dependencies
├── backend/           # Node.js + Express backend API
│   ├── routes/        # API endpoints
│   ├── models/        # Database models
│   ├── middleware/    # Authentication middleware
│   ├── seeders/       # Database seeding scripts
│   └── server.js      # Backend entry point
├── README.md          # This file
└── SETUP.md          # Detailed setup instructions
```

## 🚀 Quick Start

See [SETUP.md](SETUP.md) for detailed installation and running instructions.

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Installation

```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Running the Application

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

## 🔑 Demo Login

Demo accounts (all use password: `password123`):
- **Admin**: priya@example.com
- **Organizer**: rohan@example.com  
- **User**: aisha@example.com

## 📚 Tech Stack

**Frontend:**
- React 18
- React Router
- Tailwind CSS
- Axios
- Vite

**Backend:**
- Node.js + Express
- MongoDB (Native Driver)
- Session Authentication (express-session)
- bcryptjs

## 📖 Documentation

For complete setup instructions, API documentation, and troubleshooting, see [SETUP.md](SETUP.md).

## 🌟 Features

- User authentication with role-based access (Admin, Organizer, Volunteer)
- Event creation and management
- Event approval workflow
- RSVP and attendance tracking
- Responsive design with Tailwind CSS

Enjoy building with EcoVolunteer! 🌱
