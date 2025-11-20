const bcrypt = require('bcryptjs');
const { getDB } = require('../config/db');
const { toObjectId, collections } = require('../utils/dbHelpers');

const COLLECTION = collections.users;

const createUser = async (userData) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const user = {
        name: userData.name,
        email: userData.email.toLowerCase(),
        password: hashedPassword,
        role: userData.role || 'user',
        joinedEvents: [],
        createdEvents: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const result = await getDB().collection(COLLECTION).insertOne(user);
    return { ...user, _id: result.insertedId };
};

const findUserByEmail = (email) => {
    return getDB().collection(COLLECTION).findOne({ email: email.toLowerCase() });
};

const findUserById = (id) => {
    return getDB().collection(COLLECTION).findOne({ _id: toObjectId(id) });
};

const findUserByIdWithEvents = async (id) => {
    const users = await getDB().collection(COLLECTION).aggregate([
        { $match: { _id: toObjectId(id) } },
        {
            $lookup: {
                from: collections.events,
                localField: 'joinedEvents',
                foreignField: '_id',
                as: 'joinedEventsData'
            }
        },
        {
            $lookup: {
                from: collections.events,
                localField: 'createdEvents',
                foreignField: '_id',
                as: 'createdEventsData'
            }
        }
    ]).toArray();

    return users[0] || null;
};

const matchPassword = async (enteredPassword, hashedPassword) => {
    return await bcrypt.compare(enteredPassword, hashedPassword);
};

const updateUser = (id, updateData) => {
    return getDB().collection(COLLECTION).updateOne(
        { _id: toObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } }
    );
};

const addJoinedEvent = (userId, eventId) => {
    return getDB().collection(COLLECTION).updateOne(
        { _id: toObjectId(userId) },
        { $addToSet: { joinedEvents: toObjectId(eventId) } }
    );
};

const removeJoinedEvent = (userId, eventId) => {
    return getDB().collection(COLLECTION).updateOne(
        { _id: toObjectId(userId) },
        { $pull: { joinedEvents: toObjectId(eventId) } }
    );
};

const addCreatedEvent = (userId, eventId) => {
    return getDB().collection(COLLECTION).updateOne(
        { _id: toObjectId(userId) },
        { $push: { createdEvents: toObjectId(eventId) } }
    );
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    findUserByIdWithEvents,
    matchPassword,
    updateUser,
    addJoinedEvent,
    removeJoinedEvent,
    addCreatedEvent
};
