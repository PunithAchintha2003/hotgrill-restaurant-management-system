import express from 'express';
import multer from 'multer';
import { createGiftCard, getGiftCards, updateGiftCard, deleteGiftCard, validateCard, redeemCard} from '../controllers/giftCard.controller.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `gc-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', getGiftCards);
router.post('/', adminAuth, upload.single('image'), createGiftCard);
router.put('/:id', adminAuth, upload.single('image'), updateGiftCard);
router.delete('/:id', adminAuth, deleteGiftCard);

router.post('/validate', adminAuth, validateCard);
router.post('/redeem', adminAuth, redeemCard);

export default router;