import Employee from '../models/employee.model.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find().sort({ createdAt: -1 });
        const host = `${req.protocol}://${req.get("host")}`;
        const employeesWithImg = employees.map(emp => {
            const empObj = emp.toObject();
            return {
                ...empObj,
                photo: empObj.photo ? `${host}${empObj.photo}` : ''
            };
        });
        res.json(employeesWithImg);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createEmployee = async (req, res) => {
    try {
        const { name, contact, email, dob, gender, address, emergencyContact, salary, bonus, isPaid } = req.body;
        const photo = req.file ? `/uploads/${req.file.filename}` : '';

        const newEmployee = new Employee({
            name, contact, email, dob, gender, address, emergencyContact, 
            photo, salary, bonus, isPaid: isPaid === 'true'
        });

        await newEmployee.save();
        res.status(201).json(newEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };
        if (req.file) {
            updates.photo = `/uploads/${req.file.filename}`;
        }
        if (updates.isPaid) updates.isPaid = updates.isPaid === 'true';

        const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, { new: true });
        res.json(updatedEmployee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await Employee.findById(id);
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        if (employee.photo) {
            const filename = path.basename(employee.photo);
            const filePath = path.join(__dirname, '../uploads', filename);
            
            fs.unlink(filePath, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error("Error deleting employee photo:", err);
                }
            });
        }
        await Employee.findByIdAndDelete(id);
        res.json({ message: 'Employee deleted successfully', id });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};