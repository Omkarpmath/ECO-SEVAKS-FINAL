const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { createUser, findUserByEmail, matchPassword } = require('../collections/users');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('role').optional().isIn(['user', 'admin', 'organizer']).withMessage('Invalid role')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password, role } = req.body;

        try {
            // Check if user exists
            const userExists = await findUserByEmail(email);
            if (userExists) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create user
            const user = await createUser({
                name,
                email,
                password,
                role: role || 'user'
            });

            // Set session
            req.session.userId = user._id.toString();

            res.status(201).json({
                _id: user._id,
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Login user & create session
// @access  Public
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Please enter a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Check for user
            const user = await findUserByEmail(email);

            if (user && (await matchPassword(password, user.password))) {
                // Set session
                req.session.userId = user._id.toString();

                // Save session explicitly to ensure cookie is set before response
                req.session.save((err) => {
                    if (err) {
                        console.error('Session save error:', err);
                        return res.status(500).json({ message: 'Session error' });
                    }

                    res.json({
                        _id: user._id,
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        joinedEvents: user.joinedEvents || [],
                        createdEvents: user.createdEvents || []
                    });
                });
            } else {
                res.status(401).json({ message: 'Invalid email or password' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   POST /api/auth/logout
// @desc    Logout user & destroy session
// @access  Private
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed' });
        }
        res.clearCookie('connect.sid'); // Default session cookie name
        res.json({ message: 'Logged out successfully' });
    });
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', protect, async (req, res) => {
    // User is already attached by protect middleware
    // We might want to populate events here if needed, but for now basic info
    // The protect middleware uses findUserById which doesn't populate events by default
    // If we need populated events, we should use findUserByIdWithEvents in middleware or here

    // Let's keep it simple for now, similar to previous implementation
    res.json({
        _id: req.user._id,
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        joinedEvents: req.user.joinedEvents || [],
        createdEvents: req.user.createdEvents || []
    });
});

module.exports = router;
