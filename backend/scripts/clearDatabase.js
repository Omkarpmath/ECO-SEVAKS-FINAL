/**
 * Database Cleanup Script
 * =======================
 * Clears all test data from the database while preserving the admin user
 * 
 * WARNING: This will delete ALL users except admin, ALL events, and ALL sessions!
 * 
 * Usage:
 *   node scripts/clearDatabase.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config();

const clearDatabase = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecovoulenteer';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('ecovoulenteer');

        // 1. Delete all events
        const eventsResult = await db.collection('events').deleteMany({});
        console.log(`✅ Deleted ${eventsResult.deletedCount} events`);

        // 2. Delete all sessions
        const sessionsResult = await db.collection('sessions').deleteMany({});
        console.log(`✅ Deleted ${sessionsResult.deletedCount} sessions`);

        // 3. Delete all users EXCEPT admin
        const usersResult = await db.collection('users').deleteMany({
            email: { $ne: 'admin@ecosevaks.com' } // Keep admin user
        });
        console.log(`✅ Deleted ${usersResult.deletedCount} users (preserved admin)`);

        // 4. Clear joinedEvents and createdEvents arrays from admin user
        await db.collection('users').updateOne(
            { email: 'admin@ecosevaks.com' },
            {
                $set: {
                    joinedEvents: [],
                    createdEvents: []
                }
            }
        );
        console.log(`✅ Cleared admin user's event references`);

        console.log('\n🎉 Database cleanup complete!');
        console.log('   - Admin user preserved: admin@ecosevaks.com');
        console.log('   - All other data cleared');

    } catch (error) {
        console.error('❌ Error during cleanup:', error);
    } finally {
        await client.close();
        console.log('\nDisconnected from MongoDB');
    }
};

// Run the cleanup
clearDatabase();
