import express from 'express';
import multer from 'multer';
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from '../controllers/employee.controller.js';
import adminAuth from '../middleware/adminAuth.js'; // Ensure correct path

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `emp-${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.get('/', adminAuth, getEmployees);
router.post('/', adminAuth, upload.single('photo'), createEmployee);
router.put('/:id', adminAuth, upload.single('photo'), updateEmployee);
router.delete('/:id', adminAuth, deleteEmployee);

export default router;