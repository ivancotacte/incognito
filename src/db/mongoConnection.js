import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function connectMongoDB() {
    try {
        await client.connect();
        console.log('Connected to the database.');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
        res.status(500).json({ message: 'Error connecting to MongoDB', error });
    }
}

export default connectMongoDB;