import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    address: {
        type: String,
        required: true
    },
    emergencyContact: {
        type: String,
        required: true
    },
    photo: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    bonus: {
        type: Number,
        default: 0
    },
    isPaid: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);