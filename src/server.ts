import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { connectDB } from './config/database';
import { artistRoutes } from './routes/artist.routes';
import { authRoutes } from './routes/auth.routes';
import path from 'path';

const app = express();

app.use(cors({
  origin: '*', // Pour Angular et Ionic
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/artists', artistRoutes);

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
});


start();