const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add an event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    date: {
        type: Date,
        required: [true, 'Please add an event date']
    },
    type: {
        type: String,
        enum: ['virtual', 'in-person'],
        default: 'virtual'
    },
    location: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    imageUrl: {
        type: String,
        default: ''
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    maxVolunteers: {
        type: Number,
        default: 0,  // 0 means unlimited
        min: [0, 'Max volunteers cannot be negative']
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected', 'restricted'],
        default: 'pending'
    },
    whatToBring: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Add index for better query performance
eventSchema.index({ status: 1, date: 1 });
eventSchema.index({ organizer: 1 });

module.exports = mongoose.model('Event', eventSchema);
