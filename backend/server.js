const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');
const { connectDB, getClient } = require('./config/db');

// Load env vars
dotenv.config();

// Initialize express
const app = express();

// Connect to database
connectDB().then(() => {
    console.log('Database connection established');
}).catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Trust proxy - Required for secure cookies behind Render's reverse proxy
app.set('trust proxy', 1);

// CORS middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'https://eco-sevaks-frontend.onrender.com',
        process.env.FRONTEND_URL
    ].filter(Boolean), // Removes undefined values
    credentials: true
}));

// Session middleware
app.use(session({
    secret: process.env.SESSION_SECRET || 'ecovolunteer-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        clientPromise: Promise.resolve(getClient()), // We need to ensure client is ready or use a promise
        dbName: 'ecovoulenteer',
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 1 day
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
    }
}));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));
app.use('/api/users', require('./routes/users'));

// Root route
app.get('/', (req, res) => {
    res.json({
        message: 'EcoVolunteer API is running',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
