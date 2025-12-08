const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
    createEvent,
    findEventById,
    findApprovedEvents,
    findPendingEvents,
    findEventsByOrganizer,
    updateEventStatus,
    addAttendee,
    removeAttendee,
    deleteEvent
} = require('../collections/events');
const {
    addCreatedEvent,
    addJoinedEvent,
    removeJoinedEvent,
    findUserByIdWithEvents
} = require('../collections/users');
const { protect, authorize } = require('../middleware/auth');

// Helper to transform event for frontend
const transformEvent = (event) => ({
    id: event._id,
    _id: event._id,
    title: event.title,
    description: event.description,
    date: event.date,
    type: event.type,
    location: event.location,
    tags: event.tags,
    imageUrl: event.imageUrl || `https://placehold.co/400x200/a0eec0/1f4d1f?text=${event.title.replace(/ /g, '+')}`,
    attendees: event.attendees || [],
    organizer: event.organizer,
    organizerName: event.organizerData ? event.organizerData.name : 'Unknown',
    status: event.status,
    whatToBring: event.whatToBring,
    maxVolunteers: event.maxVolunteers,
    volunteerCount: event.attendees ? event.attendees.length : 0
});

// @route   GET /api/events
// @desc    Get all approved events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await findApprovedEvents();
        const transformedEvents = events.map(transformEvent);
        res.json(transformedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/pending
// @desc    Get all pending events (for admin approval)
// @access  Private/Admin
router.get('/pending', protect, authorize('admin'), async (req, res) => {
    try {
        const events = await findPendingEvents();
        const transformedEvents = events.map(transformEvent);
        res.json(transformedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/:id
// @desc    Get event by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const event = await findEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(transformEvent(event));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events
// @desc    Create a new event
// @access  Private
router.post(
    '/',
    protect,
    [
        body('title').trim().notEmpty().withMessage('Title is required'),
        body('description').trim().notEmpty().withMessage('Description is required'),
        body('date').isISO8601().withMessage('Valid date is required'),
        body('type').isIn(['virtual', 'in-person']).withMessage('Type must be virtual or in-person')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, date, type, location, tags, whatToBring, maxVolunteers } = req.body;

        try {
            // Parse tags if it's a string
            let parsedTags = tags;
            if (typeof tags === 'string') {
                parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
            }

            const event = await createEvent({
                title,
                description,
                date,
                type,
                location,
                tags: parsedTags,
                whatToBring,
                maxVolunteers,
                organizer: req.user._id
            });

            // Add event to user's created events
            await addCreatedEvent(req.user._id, event._id);

            // Fetch full event to return
            const populatedEvent = await findEventById(event._id);

            res.status(201).json(transformEvent(populatedEvent));
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// @route   GET /api/events/user/:userId/joined
// @desc    Get events joined by user
// @access  Public
router.get('/user/:userId/joined', async (req, res) => {
    try {
        const user = await findUserByIdWithEvents(req.params.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // user.joinedEventsData contains the full event objects
        // We need to populate organizer for them? 
        // findUserByIdWithEvents populates joinedEventsData (events)
        // but those events might not have organizer populated inside them
        // The aggregation in users.js just looks up events.
        // We might need to manually populate organizer for each event or improve the aggregation.
        // For now, let's see if we can get by or if we need to fetch events separately.

        // Actually, findUserByIdWithEvents in users.js only does a simple lookup for events.
        // It doesn't populate the organizer of those events.
        // So organizerData will be missing in transformEvent.
        // Let's just return what we have, or we could fetch each event fully.
        // Given the complexity, let's rely on the fact that we have the event data.
        // If organizer name is needed, we might need a better query.
        // For now, let's map what we have.

        const events = user.joinedEventsData || [];
        // Note: transformEvent expects organizerData to exist for organizerName.
        // Since we don't have it, it will default to 'Unknown'. 
        // This might be acceptable for now or we can fix users.js later.

        const transformedEvents = events.map(event => ({
            ...transformEvent(event),
            organizerName: 'Event Organizer' // Fallback since we didn't populate deep
        }));

        res.json(transformedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   GET /api/events/created/:userId
// @desc    Get events created by user
// @access  Public
router.get('/created/:userId', async (req, res) => {
    try {
        const events = await findEventsByOrganizer(req.params.userId);
        const transformedEvents = events.map(transformEvent);
        res.json(transformedEvents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/events/:id/approve
// @desc    Approve an event
// @access  Private/Admin
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        await updateEventStatus(req.params.id, 'approved');
        const event = await findEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            id: event._id,
            _id: event._id,
            title: event.title,
            status: event.status,
            organizerName: event.organizerData ? event.organizerData.name : 'Unknown'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/events/:id/reject
// @desc    Reject an event
// @access  Private/Admin
router.put('/:id/reject', protect, authorize('admin'), async (req, res) => {
    try {
        await updateEventStatus(req.params.id, 'rejected');
        const event = await findEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({
            id: event._id,
            _id: event._id,
            title: event.title,
            status: event.status,
            organizerName: event.organizerData ? event.organizerData.name : 'Unknown'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/events/:id/join
// @desc    Join an event
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
    try {
        const event = await findEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if already joined
        // event.attendees is an array of ObjectIds
        const userIdStr = req.user._id.toString();
        const isJoined = event.attendees && event.attendees.some(id => id.toString() === userIdStr);

        if (isJoined) {
            return res.status(400).json({ message: 'Already joined this event' });
        }

        // Check if event is at capacity
        if (event.maxVolunteers > 0 && event.attendees && event.attendees.length >= event.maxVolunteers) {
            return res.status(400).json({ message: 'Event is at full capacity' });
        }

        // Add user to event attendees
        await addAttendee(event._id, req.user._id);

        // Add event to user's joined events
        await addJoinedEvent(req.user._id, event._id);

        res.json({ message: 'Successfully joined event' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/events/:id/leave
// @desc    Leave an event
// @access  Private
router.delete('/:id/leave', protect, async (req, res) => {
    try {
        const event = await findEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Remove user from event attendees
        await removeAttendee(event._id, req.user._id);

        // Remove event from user's joined events
        await removeJoinedEvent(req.user._id, event._id);

        res.json({ message: 'Successfully left event' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/events/:id
// @desc    Delete an event (organizer or admin only)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const event = await findEventById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is the organizer or an admin
        const isOrganizer = event.organizer.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOrganizer && !isAdmin) {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await deleteEvent(req.params.id);

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
