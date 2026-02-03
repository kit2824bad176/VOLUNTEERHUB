const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Activity = require('./models/Activity');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });

const seedData = async () => {
    try {
        await Activity.deleteMany();
        await User.deleteMany();

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin',
            isAdmin: true
        });

        const user1 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: hashedPassword,
            role: 'student'
        });

        const activities = [
            {
                title: 'Community Park Cleanup',
                description: 'Join us for a day of cleaning up the local community park. We will be picking up trash, planting flowers, and painting benches.',
                date: new Date('2023-10-25'),
                location: 'Central Park',
                organizer: 'Green Earth',
                status: 'completed',
                capacity: 20,
                createdBy: adminUser._id,
                registeredVolunteers: [
                    { user: user1._id, status: 'completed' }
                ]
            },
            {
                title: 'Food Bank Distribution',
                description: 'Help distribute food to families in need. Volunteers are needed to pack boxes and load cars.',
                date: new Date('2026-11-10'),
                location: 'City Food Bank',
                organizer: 'Helping Hands',
                status: 'upcoming',
                capacity: 10,
                createdBy: adminUser._id,
                registeredVolunteers: []
            },
            {
                title: 'Senior Center Visit',
                description: 'Spend time with seniors at the local nursing home. Activities include playing games, reading, and chatting.',
                date: new Date('2026-12-05'),
                location: 'Sunny Days Senior Center',
                organizer: 'Care Corps',
                status: 'upcoming',
                capacity: 5,
                createdBy: adminUser._id,
                registeredVolunteers: []
            }
        ];

        await Activity.insertMany(activities);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

seedData();
