import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact: { type: String, required: true },
  password: { type: String, required: true },
  
  // Default role is 'user', but can be 'admin'
  role: { 
    type: String, 
    default: 'user', 
    enum: ['user', 'admin'] 
  },
  
  // For Forgot Password feature
  resetOtp: { type: String },
  
  // For Account Update (Email/Password) feature
  accountUpdateOtp: { type: String },

}, { timestamps: true }); // Automatically creates 'createdAt' and 'updatedAt'

const User = mongoose.model('User', userSchema);

export default User;