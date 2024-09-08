import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import personModel from './model/Person.js'; // Include the '.js' extension
import dbConnect from './lib/dbConnect.js';  // Include the '.js' extension

async function seedData() {
    // Connect to MongoDB
    await dbConnect();

    // Data to seed
    const seedPersons = [
        {
            username: 'Unknwon',
            password: await bcrypt.hash('password', 10), // Hashing password
            role: 'Dean',
            email: 'john@example.com',
            joinedOn: new Date(),
        },
        {
            username: 'Student',
            password: await bcrypt.hash('password', 10),
            role: 'Student',
            email: 'jane@example.com',
            joinedOn: new Date(),
        },
    ];

    try {
        // Clear the collection before seeding
        await personModel.deleteMany({});

        // Insert seed data
        const result = await personModel.insertMany(seedPersons);

        console.log('Data successfully seeded:', result);
        mongoose.connection.close(); // Close the connection when done
    } catch (error) {
        console.error('Error seeding data:', error);
        mongoose.connection.close();
    }
}

seedData();
