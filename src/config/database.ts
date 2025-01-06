import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!, {
      maxPoolSize: 10, // Maintient jusqu'à 10 connexions socket
      serverSelectionTimeoutMS: 5000, // Durée d'attente pour la sélection du serveur
      socketTimeoutMS: 45000, // Durée avant timeout des opérations
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};