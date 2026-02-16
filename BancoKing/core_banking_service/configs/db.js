import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Core Banking DB Connected');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};