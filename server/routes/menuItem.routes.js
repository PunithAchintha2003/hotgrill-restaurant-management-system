import express from 'express';
import multer from 'multer';
import { createMenuItem, getMenuItems, deleteMenuItem, getMenuItemById, updateMenuItem } from '../controllers/menuItemController.js';

const menuRouter = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
})

const upload = multer({ storage });

menuRouter.post('/', upload.single('image'), createMenuItem);
menuRouter.get('/', getMenuItems);
menuRouter.get('/:id', getMenuItemById);
menuRouter.delete('/:id', deleteMenuItem);
menuRouter.put('/:id', upload.single('image'), updateMenuItem);

export default menuRouter;