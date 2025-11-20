const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const collections = {
    users: 'users',
    events: 'events'
};

// Helper to validate and convert ObjectId
const toObjectId = (id) => {
    if (!id) {
        throw new Error('ID is required');
    }
    if (ObjectId.isValid(id)) {
        return new ObjectId(id);
    }
    throw new Error('Invalid ObjectId');
};

// Generic CRUD operations
const findOne = (collection, query) => {
    return getDB().collection(collection).findOne(query);
};

const find = (collection, query = {}, options = {}) => {
    return getDB().collection(collection).find(query, options).toArray();
};

const insertOne = (collection, doc) => {
    return getDB().collection(collection).insertOne(doc);
};

const updateOne = (collection, query, update) => {
    return getDB().collection(collection).updateOne(query, update);
};

const deleteOne = (collection, query) => {
    return getDB().collection(collection).deleteOne(query);
};

const deleteMany = (collection, query) => {
    return getDB().collection(collection).deleteMany(query);
};

const aggregate = (collection, pipeline) => {
    return getDB().collection(collection).aggregate(pipeline).toArray();
};

module.exports = {
    collections,
    toObjectId,
    findOne,
    find,
    insertOne,
    updateOne,
    deleteOne,
    deleteMany,
    aggregate
};
