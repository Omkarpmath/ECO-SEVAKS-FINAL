const { getDB } = require('../config/db');
const { toObjectId, collections, aggregate } = require('../utils/dbHelpers');

const COLLECTION = collections.events;

const createEvent = async (eventData) => {
    const event = {
        title: eventData.title,
        description: eventData.description,
        date: new Date(eventData.date),
        type: eventData.type,
        location: eventData.location || '',
        tags: eventData.tags || [],
        imageUrl: eventData.imageUrl || '',
        attendees: [],
        organizer: toObjectId(eventData.organizer),
        maxVolunteers: eventData.maxVolunteers || 0,
        status: 'pending',
        whatToBring: eventData.whatToBring || '',
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await getDB().collection(COLLECTION).insertOne(event);
    return { ...event, _id: result.insertedId };
};

const findEventById = async (id) => {
    const events = await getDB().collection(COLLECTION).aggregate([
        { $match: { _id: toObjectId(id) } },
        {
            $lookup: {
                from: collections.users,
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizerData'
            }
        },
        {
            $lookup: {
                from: collections.users,
                localField: 'attendees',
                foreignField: '_id',
                as: 'attendeesData'
            }
        },
        { $unwind: { path: '$organizerData', preserveNullAndEmptyArrays: true } }
    ]).toArray();

    return events[0] || null;
};

const findApprovedEvents = async () => {
    return await getDB().collection(COLLECTION).aggregate([
        { $match: { status: 'approved' } },
        {
            $lookup: {
                from: collections.users,
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizerData'
            }
        },
        {
            $lookup: {
                from: collections.users,
                localField: 'attendees',
                foreignField: '_id',
                as: 'attendeesData'
            }
        },
        { $unwind: { path: '$organizerData', preserveNullAndEmptyArrays: true } },
        { $sort: { date: 1 } }
    ]).toArray();
};

const findPendingEvents = async () => {
    return await getDB().collection(COLLECTION).aggregate([
        { $match: { status: 'pending' } },
        {
            $lookup: {
                from: collections.users,
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizerData'
            }
        },
        { $unwind: { path: '$organizerData', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } }
    ]).toArray();
};

const findEventsByOrganizer = async (organizerId) => {
    return await getDB().collection(COLLECTION).aggregate([
        { $match: { organizer: toObjectId(organizerId) } },
        {
            $lookup: {
                from: collections.users,
                localField: 'organizer',
                foreignField: '_id',
                as: 'organizerData'
            }
        },
        {
            $lookup: {
                from: collections.users,
                localField: 'attendees',
                foreignField: '_id',
                as: 'attendeesData'
            }
        },
        { $unwind: { path: '$organizerData', preserveNullAndEmptyArrays: true } },
        { $sort: { createdAt: -1 } }
    ]).toArray();
};

const updateEventStatus = (eventId, status) => {
    return getDB().collection(COLLECTION).updateOne(
        { _id: toObjectId(eventId) },
        { $set: { status, updatedAt: new Date() } }
    );
};

const addAttendee = (eventId, userId) => {
    return getDB().collection(COLLECTION).updateOne(
        { _id: toObjectId(eventId) },
        { $addToSet: { attendees: toObjectId(userId) } }
    );
};

const removeAttendee = (eventId, userId) => {
    return getDB().collection(COLLECTION).updateOne(
        { _id: toObjectId(eventId) },
        { $pull: { attendees: toObjectId(userId) } }
    );
};

const deleteEvent = async (eventId) => {
    return await getDB().collection(COLLECTION).deleteOne({ _id: toObjectId(eventId) });
};

module.exports = {
    createEvent,
    findEventById,
    findApprovedEvents,
    findPendingEvents,
    findEventsByOrganizer,
    updateEventStatus,
    addAttendee,
    removeAttendee,
    deleteEvent
};
