const dotenv = require('dotenv');
const path = require('path');
const { connectDB, getDB } = require('../config/db');
const { createUser, findUserByEmail } = require('../collections/users');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedAdmin = async () => {
    try {
        // Connect to database
        await connectDB();

        const adminEmail = 'admin@ecosevaks.com';
        const adminPassword = 'Admin@123';

        // Check if admin already exists
        const existingAdmin = await findUserByEmail(adminEmail);

        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log(`Email: ${adminEmail}`);
            console.log('Use the existing password or update it directly in the database.');
            process.exit(0);
        }

        // Create admin user
        const admin = await createUser({
            name: 'Admin',
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        console.log('✅ Admin user created successfully!');
        console.log('');
        console.log('Admin Credentials:');
        console.log(`  Email: ${adminEmail}`);
        console.log(`  Password: ${adminPassword}`);
        console.log('');
        console.log('⚠️  Please change this password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

seedAdmin();
