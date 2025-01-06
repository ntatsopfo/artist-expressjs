import { Schema, model } from 'mongoose';

const socialNetworkSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true }
});

const artistSchema = new Schema({
  name: { type: String, required: true },
  stageName: { type: String, required: true },
  image: { type: String, required: true },
  numberOfAlbums: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  numberOfRatings: { type: Number, default: 0 },
  socialNetworks: [socialNetworkSchema],
  label: { type: String, required: true },
  publisher: { type: String, required: true },
  careerStartDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Artist = model('Artist', artistSchema);