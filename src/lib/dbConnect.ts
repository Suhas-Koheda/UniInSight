import mongoose from "mongoose";
import personModel from "../model/Person"; // Adjust the path as necessary
import bcrypt from "bcryptjs";

type ConnectionObject = {
    isConnected?: number;
};

const conn: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    if (conn.isConnected) {
        console.log("Using existing connection");
        return;
    }

    try {
        console.log("Connecting to database...");
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        conn.isConnected = db.connections[0].readyState;
        console.log("New connection created");

        console.log("Seeding data...");
        await seedData();
    } catch (err) {
        console.error("Database connection failed");
        console.error(err);
        process.exit(1);
    }
}

async function seedData() {
    const seedPersons = [
        {
            username: 'Dean',
            password: await bcrypt.hash('password', 10),
            role: 'Dean',
            email: 'Unknown@gmail.com',
            joinedOn: new Date(),
        },
        {
            username: 'Student',
            password: await bcrypt.hash('password', 10),
            role: 'Student',
            email: 'Unknown@gmail.com',
            joinedOn: new Date(),
        },
        {
            username: 'Hod',
            password: await bcrypt.hash('password', 10),
            role: 'Hod',
            email: 'Unknown@gmail.com',
            joinedOn: new Date(),
        },
        {
            username: 'Faculty',
            password: await bcrypt.hash('password', 10),
            role: 'Faculty',
            email: 'Unknown@gmail.com',
            joinedOn: new Date(),
        },
    ];

    try {
        console.log("Clearing collection...");
        await personModel.deleteMany({});

        console.log("Inserting seed data...");
        const result = await personModel.insertMany(seedPersons);

        console.log('Data successfully seeded:', result);
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

export default dbConnect;
