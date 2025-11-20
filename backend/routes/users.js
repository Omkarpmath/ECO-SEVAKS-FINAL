const express = require('express');
const router = express.Router();
const { findUserByIdWithEvents } = require('../collections/users');

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const user = await findUserByIdWithEvents(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Remove password from response
        const { password, ...userWithoutPassword } = user;

        res.json({
            id: user._id,
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            joinedEvents: user.joinedEventsData || [],
            createdEvents: user.createdEventsData || []
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
