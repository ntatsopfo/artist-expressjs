import { Router } from 'express';
import { ArtistController } from '../controllers/artist.controller';
import { auth } from '../middleware/auth';
import { upload } from '../config/multer';

const router = Router();

router.post('/', auth, upload.single('image'), ArtistController.create);
router.get('/', ArtistController.getAll);
router.get('/search', ArtistController.search);
router.get('/:id', ArtistController.getOne);
router.patch('/:id', auth, upload.single('image'), ArtistController.update);
router.delete('/:id', auth, ArtistController.delete);
router.post('/:id/rate', auth, ArtistController.rateArtist);

export const artistRoutes = router;