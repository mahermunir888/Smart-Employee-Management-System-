import User from './models/User.js';
import bcrypt from 'bcrypt';
import connectToDatabase from './db/db.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const createAdmin = async () => {
    try {
        await connectToDatabase();
        
        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
        if (existingAdmin) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Create new admin user
        const hashedPassword = await bcrypt.hash('admin', 10);
        const adminUser = new User({
            name: 'Admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            role: 'Admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin user:', error);
        process.exit(1);
    }
};

createAdmin(); 