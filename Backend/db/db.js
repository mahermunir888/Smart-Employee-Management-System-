import mongoose from "mongoose";
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectToDatabase = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not defined in environment variables');
        }
        
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectToDatabase;