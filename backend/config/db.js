const { MongoClient } = require('mongodb');

let db = null;
let client = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecovoulenteer';
    client = new MongoClient(uri);

    await client.connect();
    db = client.db('ecovoulenteer');

    console.log(`MongoDB Connected: ${client.s.options.hosts[0]}`);
    return db;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const getClient = () => {
  if (!client) {
    throw new Error('Client not initialized. Call connectDB first.');
  }
  return client;
};

module.exports = { connectDB, getDB, getClient };
