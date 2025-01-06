import { Request, Response } from 'express';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const user = new User(req.body);
      await user.save();
      
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.status(201).send({ user, token });
    } catch (error) {
      res.status(400).send(error);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid login credentials');
      }
      
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );
      
      res.send({ user, token });
    } catch (error) {
      res.status(400).send({ error: 'Invalid login credentials' });
    }
  }
}