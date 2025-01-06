import { NextFunction, Request, Response } from 'express';
import { Artist } from '../models/Artist';
import { Rating } from '../models/Rating';

export class ArtistController {
  static async create(req: Request, res: Response) {
    try {

    const artistData = {
      ...req.body,
      socialNetworks: req.body.socialNetworks ? JSON.parse(req.body.socialNetworks) : [],
      image: req.file ? `/uploads/${req.file.filename}` : null
    };

    const artist = new Artist(artistData);
    await artist.save();
    res.status(201).send(artist);
  } catch (e: unknown) {
    const error = e as Error;
    console.error('Error creating artist:', error);
    res.status(400).send({
      message: "Erreur lors de la création de l'artiste",
      error: error.message
    });
  }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const artists = await Artist.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Artist.countDocuments();

      res.send({
        artists,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }

  static getOne = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const artist = await Artist.findById(req.params.id);
      if (!artist) {
        res.status(404).json({ message: 'Artist not found' });
        return;
      }
      res.json(artist);
    } catch (error) {
      next(error);
    }
  }

  static update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const updates = {
        ...req.body,
        socialNetworks: req.body.socialNetworks ? JSON.parse(req.body.socialNetworks) : [],
        image: req.file ? `/uploads/${req.file.filename}` : req.body.image
      };
 
      const artist = await Artist.findByIdAndUpdate(
        req.params.id,
        updates,
        { new: true, runValidators: true }
      );
 
      if (!artist) {
        res.status(404).json({ message: 'Artist not found' });
        return;
      }
      res.json(artist);
    } catch (error) {
      next(error);
    }
  }

  static delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const artist = await Artist.findByIdAndDelete(req.params.id);
      if (!artist) {
        res.status(404).json({ message: 'Artist not found' });
        return;
      }
      res.json(artist);
    } catch (error) {
      next(error);
    }
  }

  static async rateArtist(req: Request, res: Response) {
    try {
      const { rating } = req.body;
      const artistId = req.params.id;
      const userId = req.user.userId;

      // Create or update rating
      const ratingDoc = await Rating.findOneAndUpdate(
        { artistId, userId },
        { rating },
        { upsert: true, new: true }
      );

      // Calculate new average rating
      const ratings = await Rating.find({ artistId });
      const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
      const averageRating = totalRating / ratings.length;

      // Update artist rating
      const artist = await Artist.findByIdAndUpdate(
        artistId,
        {
          rating: averageRating,
          numberOfRatings: ratings.length
        },
        { new: true }
      );

      res.send({ rating: ratingDoc, artist });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async search(req: Request, res: Response) {
    try {
      const searchTerm = req.query.q as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const query = {
        $or: [
          { name: new RegExp(searchTerm, 'i') },
          { stageName: new RegExp(searchTerm, 'i') }
        ]
      };

      const artists = await Artist.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Artist.countDocuments(query);

      res.send({
        artists,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total
      });
    } catch (error) {
      res.status(500).send(error);
    }
  }
}