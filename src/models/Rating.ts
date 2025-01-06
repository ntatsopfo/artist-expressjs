import { Schema, model } from 'mongoose';

const ratingSchema = new Schema({
  artistId: { type: Schema.Types.ObjectId, ref: 'Artist', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 0, max: 5 },
  createdAt: { type: Date, default: Date.now }
});

// Ensure one rating per user per artist
ratingSchema.index({ artistId: 1, userId: 1 }, { unique: true });

export const Rating = model('Rating', ratingSchema);