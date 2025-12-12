const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const clearDatabase = async () => {
    let client;

    try {
        // Connect to database
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecovoulenteer';
        client = new MongoClient(uri);

        await client.connect();
        const db = client.db('ecovoulenteer');

        console.log('✓ Connected to database');

        // Get collections
        const usersCollection = db.collection('users');
        const eventsCollection = db.collection('events');

        // Count current data
        const totalUsers = await usersCollection.countDocuments();
        const adminUsers = await usersCollection.countDocuments({ role: 'admin' });
        const regularUsers = totalUsers - adminUsers;
        const totalEvents = await eventsCollection.countDocuments();

        console.log('\n📊 Current Database Status:');
        console.log(`   Total Users: ${totalUsers}`);
        console.log(`   Admin Users: ${adminUsers}`);
        console.log(`   Regular Users: ${regularUsers}`);
        console.log(`   Total Events: ${totalEvents}`);

        // Ask for confirmation
        console.log('\n⚠️  WARNING: This will DELETE:');
        console.log(`   • All ${regularUsers} regular users`);
        console.log(`   • All ${totalEvents} events`);
        console.log(`   • This will PRESERVE ${adminUsers} admin account(s)`);
        console.log('\nPress Ctrl+C to cancel, or wait 5 seconds to proceed...\n');

        // Wait 5 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));

        console.log('🗑️  Starting cleanup...\n');

        // Delete all regular users (keep admins)
        const deletedUsers = await usersCollection.deleteMany({ role: { $ne: 'admin' } });
        console.log(`✓ Deleted ${deletedUsers.deletedCount} regular users`);

        // Delete all events
        const deletedEvents = await eventsCollection.deleteMany({});
        console.log(`✓ Deleted ${deletedEvents.deletedCount} events`);

        // Show remaining data
        const remainingUsers = await usersCollection.countDocuments();
        const remainingAdmins = await usersCollection.countDocuments({ role: 'admin' });

        console.log('\n✅ Cleanup Complete!');
        console.log('📊 Final Database Status:');
        console.log(`   Remaining Users: ${remainingUsers} (all admins)`);
        console.log(`   Admin Users: ${remainingAdmins}`);
        console.log(`   Total Events: 0`);

        // List remaining admin accounts
        if (remainingAdmins > 0) {
            console.log('\n👤 Preserved Admin Accounts:');
            const admins = await usersCollection.find({ role: 'admin' })
                .project({ name: 1, email: 1 })
                .toArray();
            admins.forEach((admin, index) => {
                console.log(`   ${index + 1}. ${admin.name} (${admin.email})`);
            });
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        // Close database connection
        if (client) {
            await client.close();
            console.log('\n✓ Database connection closed');
        }
        process.exit(0);
    }
};

// Run the cleanup
clearDatabase();

