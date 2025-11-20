const dotenv = require('dotenv');
const { connectDB, getDB } = require('../config/db');
const { createUser, addJoinedEvent, addCreatedEvent } = require('../collections/users');
const { createEvent, addAttendee, updateEventStatus } = require('../collections/events');

const path = require('path');
// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('MONGO_URI:', process.env.MONGO_URI ? 'Defined' : 'Undefined');

const seedData = async () => {
    try {
        // Connect to database
        await connectDB();
        const db = getDB();

        // Clear existing data
        try {
            await db.collection('users').drop();
            await db.collection('events').drop();
            await db.collection('sessions').drop();
            console.log('Collections dropped');
        } catch (error) {
            console.log('Collections might not exist, skipping drop');
        }

        // Create users
        const usersData = [
            {
                name: 'Aisha Khan',
                email: 'aisha@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Rohan Sharma',
                email: 'rohan@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Priya Singh',
                email: 'priya@example.com',
                password: 'password123',
                role: 'admin'
            },
            {
                name: 'Deepak Rao',
                email: 'deepak@example.com',
                password: 'password123',
                role: 'user'
            },
            {
                name: 'Meera Iyer',
                email: 'meera@example.com',
                password: 'password123',
                role: 'user'
            }
        ];

        const users = [];
        for (const userData of usersData) {
            const user = await createUser(userData);
            users.push(user);
        }

        console.log('Users created');

        // Create events
        const eventsData = [
            {
                title: 'Mithi River Cleanup (Mumbai)',
                description: 'Join us to clean the banks of the Mithi River near BKC. We provide gloves, bags, and tools. Let\'s restore our river!',
                date: new Date('2025-11-22T10:00:00'),
                type: 'in-person',
                location: 'Mithi River, BKC, Mumbai',
                tags: ['cleanup', 'mumbai', 'in-person', 'river'],
                imageUrl: 'https://images.unsplash.com/photo-1670071644336-cb8294578326?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340',
                organizerIndex: 1,
                attendeeIndices: [2, 3],
                maxVolunteers: 30,
                status: 'approved',
                whatToBring: 'Water bottle, sun hat, and sturdy shoes. We provide gloves and bags.'
            },
            {
                title: 'Webinar: Sustainable Living in India',
                description: 'Learn about sustainable living practices from experts. This webinar will cover waste segregation, composting, and sustainable choices in an Indian context.',
                date: new Date('2025-11-25T18:00:00'),
                type: 'virtual',
                location: 'Zoom',
                tags: ['webinar', 'education', 'virtual', 'sustainability'],
                imageUrl: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjc5ODV8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwd2ViaW5hcnxlbnwwfHx8fDE3MjA3MzM4NTF8MA&ixlib=rb-4.0.3&q=80&w=1080',
                organizerIndex: 1,
                attendeeIndices: [0, 4],
                maxVolunteers: 100,
                status: 'approved'
            },
            {
                title: 'Yamuna Ghat Tree Plantation (Delhi)',
                description: 'Help us restore the Yamuna riverbank by planting native trees. This event is crucial for fighting pollution and improving water quality. All welcome!',
                date: new Date('2025-12-05T09:00:00'),
                type: 'in-person',
                location: 'Yamuna Ghat, New Delhi',
                tags: ['tree planting', 'conservation', 'in-person', 'delhi'],
                imageUrl: 'https://images.unsplash.com/photo-1579143423970-1cee5f4e951c?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
                organizerIndex: 1,
                attendeeIndices: [],
                maxVolunteers: 50,
                status: 'approved',
                whatToBring: 'Comfortable clothes, gardening gloves (if you have them), and a reusable water bottle.'
            },
            {
                title: 'Eco-Brick Workshop (Bangalore)',
                description: 'Learn how to turn your plastic waste into useful eco-bricks. A hands-on workshop at Cubbon Park. Bring your clean, dry plastic bottles!',
                date: new Date('2025-12-10T14:00:00'),
                type: 'in-person',
                location: 'Cubbon Park, Bangalore',
                tags: ['workshop', 'recycling', 'in-person', 'bangalore'],
                imageUrl: 'https://images.unsplash.com/photo-1568276855554-0e75e3143329?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2342',
                organizerIndex: 1,
                attendeeIndices: [0],
                maxVolunteers: 20,
                status: 'approved',
                whatToBring: 'Clean and dry plastic bottles, and any non-biodegradable plastic waste you have.'
            },
            {
                title: 'Juhu Beach Cleanup Drive (Mumbai)',
                description: 'Let\'s clean our beautiful Juhu coastline! Join us this Sunday. All are welcome.',
                date: new Date('2025-11-30T09:00:00'),
                type: 'in-person',
                location: 'Juhu Beach, Mumbai',
                tags: ['cleanup', 'beach', 'in-person', 'mumbai'],
                imageUrl: 'https://images.unsplash.com/photo-1618477462028-dd464cf363dd?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2070',
                organizerIndex: 1,
                attendeeIndices: [],
                maxVolunteers: 40,
                status: 'pending',
                whatToBring: 'Cap, sunscreen, and a water bottle. We provide all cleaning supplies.'
            },
            {
                title: 'Hooghly Riverbank Cleanup (Kolkata)',
                description: 'Join the effort to clean the historic ghats of the Hooghly river. Let\'s protect our heritage and our water source.',
                date: new Date('2025-12-07T08:00:00'),
                type: 'in-person',
                location: 'Prinsep Ghat, Kolkata',
                tags: ['cleanup', 'kolkata', 'in-person', 'river'],
                imageUrl: 'https://images.unsplash.com/photo-1612510158990-a675aa31b009?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=2340',
                organizerIndex: 3,
                attendeeIndices: [],
                maxVolunteers: 25,
                status: 'approved',
                whatToBring: 'Sunscreen, water bottle, and face mask. All tools will be provided.'
            },
            {
                title: 'Marina Beach Awareness Campaign (Chennai)',
                description: 'Help us spread awareness about plastic pollution to visitors at Marina Beach. We will be distributing pamphlets and talking to people.',
                date: new Date('2025-12-14T16:00:00'),
                type: 'in-person',
                location: 'Marina Beach, Chennai',
                tags: ['awareness', 'chennai', 'in-person', 'beach'],
                imageUrl: 'https://images.unsplash.com/photo-1599154958156-df322edbb8c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wzNjc5ODV8MHwxfHNlYXJjaHwxfHxtYXJpbmElMjBiZWFjaCUyMGNoZW5uYWl8ZW58MHx8fHwxNzIwNzQyMTM5fDA&ixlib=rb-4.0.3&q=80&w=1080',
                organizerIndex: 4,
                attendeeIndices: [],
                maxVolunteers: 15,
                status: 'pending',
                whatToBring: 'Just your enthusiasm and a smile! We provide t-shirts and materials.'
            }
        ];

        for (const eventData of eventsData) {
            const organizer = users[eventData.organizerIndex];

            const event = await createEvent({
                ...eventData,
                organizer: organizer._id
            });

            // Update status if needed (createEvent defaults to pending)
            if (eventData.status !== 'pending') {
                await updateEventStatus(event._id, eventData.status);
            }

            // Link event to organizer
            await addCreatedEvent(organizer._id, event._id);

            // Add attendees
            for (const attendeeIndex of eventData.attendeeIndices) {
                const attendee = users[attendeeIndex];
                await addAttendee(event._id, attendee._id);
                await addJoinedEvent(attendee._id, event._id);
            }
        }

        console.log('Events created');
        console.log('Database seeded successfully!');
        console.log('\nDemo Users:');
        console.log('1. Email: aisha@example.com (User) - Password: password123');
        console.log('2. Email: rohan@example.com (User) - Password: password123');
        console.log('3. Email: priya@example.com (Admin) - Password: password123');
        console.log('4. Email: deepak@example.com (User) - Password: password123');
        console.log('5. Email: meera@example.com (User) - Password: password123');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
