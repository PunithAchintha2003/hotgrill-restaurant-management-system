import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// CORRECTED: Reference variables by their names, not their values
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Will read sandunitharushika15@gmail.com from .env
    pass: process.env.EMAIL_PASS, // Will read oqzo gdzo hnlv qxzv from .env
  },
});

router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// SIGNUP ROUTE
router.post('/signup', async (req, res) => {
  const { email, name, contact, password, adminCode } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    let role = 'user';
    if (adminCode === process.env.ADMIN_SECRET_KEY) {
      role = 'admin';
    }

    user = new User({ email, name, contact, password, role });
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    res.json({ msg: `Successfully registered as ${role}` });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// LOGIN ROUTE
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

    const payload = { user: { id: user.id, role: user.role } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, role: user.role });
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 1. SEND OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOtp = otp;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'HotGrill Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}. It will expire soon.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: 'OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. VERIFY OTP
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  try {
    const user = await User.findOne({ email, resetOtp: otp });
    if (!user) return res.status(400).json({ msg: 'Invalid or expired OTP' });

    user.resetOtp = undefined;
    await user.save();

    res.json({ msg: 'OTP Verified' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3. RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ msg: 'Password updated successfully!' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// ACCOUNT UPDATE ROUTES (AUTHENTICATED)

// 1. SEND OTP FOR ACCOUNT UPDATES
router.post('/account/send-otp', auth, async (req, res) => {
  const { newEmail } = req.body; // For email updates, send OTP to new email
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Determine which email to send OTP to
    const emailToSend = newEmail || user.email; // Use newEmail if provided (for email updates), otherwise current email (for password updates)
    
    // If newEmail is provided, check if it already exists
    if (newEmail) {
      const normalizedNewEmail = newEmail.trim().toLowerCase();
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedNewEmail)) {
        return res.status(400).json({ msg: 'Invalid email format' });
      }
      
      // Check if new email is the same as current email (case-insensitive)
      if (normalizedNewEmail === user.email.toLowerCase().trim()) {
        return res.status(400).json({ msg: 'New email must be different from current email' });
      }
      
      // Check if new email already exists (case-insensitive)
      // Try multiple query approaches for reliability
      let existingUser = null;
      
      // First try: Direct case-insensitive regex (most common approach)
      try {
        const escapedEmail = normalizedNewEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        existingUser = await User.findOne({ 
          email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } 
        });
      } catch (regexError) {
        // Fallback: Find all and filter (less efficient but more reliable)
        const allUsers = await User.find({});
        existingUser = allUsers.find(u => u.email && u.email.toLowerCase().trim() === normalizedNewEmail) || null;
      }
      
      // Only return error if the existing user is a DIFFERENT user
      // If it's the same user, allow it (they might be changing back to a previous email)
      if (existingUser) {
        const existingUserId = existingUser._id.toString();
        const currentUserId = user._id.toString();
        
        // If it's a different user, block it
        if (existingUserId !== currentUserId) {
          return res.status(400).json({ msg: 'Email already in use' });
        }
        // If it's the same user, allow it (they're changing back to their own email)
      }
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.accountUpdateOtp = otp;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailToSend,
      subject: newEmail ? 'HotGrill Email Update OTP' : 'HotGrill Account Update OTP',
      text: newEmail 
        ? `Your OTP for email update is: ${otp}. Please verify this OTP to complete your email change. It will expire soon.`
        : `Your OTP for account update is: ${otp}. It will expire soon.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ msg: newEmail ? `OTP sent to ${newEmail}` : 'OTP sent to your email.' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 2. VERIFY OTP FOR ACCOUNT UPDATES
router.post('/account/verify-otp', auth, async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Verify OTP - normalize both values to strings and trim whitespace
    const storedOtp = user.accountUpdateOtp ? String(user.accountUpdateOtp).trim() : '';
    const providedOtp = otp ? String(otp).trim() : '';
    
    if (!storedOtp || storedOtp !== providedOtp) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Clear OTP after verification
    user.accountUpdateOtp = undefined;
    await user.save();

    res.json({ msg: 'OTP Verified', verified: true });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// 3. UPDATE EMAIL
router.put('/account/update-email', auth, async (req, res) => {
  const { newEmail, otp } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Verify OTP - normalize both values to strings and trim whitespace
    const storedOtp = user.accountUpdateOtp ? String(user.accountUpdateOtp).trim() : '';
    const providedOtp = otp ? String(otp).trim() : '';
    
    if (!storedOtp || storedOtp !== providedOtp) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Validate and normalize email (trim and lowercase)
    if (!newEmail || typeof newEmail !== 'string') {
      return res.status(400).json({ msg: 'Invalid email address' });
    }
    
    const normalizedNewEmail = newEmail.trim().toLowerCase();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedNewEmail)) {
      return res.status(400).json({ msg: 'Invalid email format' });
    }
    
    // Check if new email is the same as current email (case-insensitive)
    if (normalizedNewEmail === user.email.toLowerCase().trim()) {
      return res.status(400).json({ msg: 'New email must be different from current email' });
    }

    // Check if new email already exists (case-insensitive search)
    // Try multiple query approaches for reliability
    let existingUser = null;
    
    // First try: Direct case-insensitive regex (most common approach)
    try {
      const escapedEmail = normalizedNewEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      existingUser = await User.findOne({ 
        email: { $regex: new RegExp(`^${escapedEmail}$`, 'i') } 
      });
    } catch (regexError) {
      // Fallback: Find all and filter (less efficient but more reliable)
      const allUsers = await User.find({});
      existingUser = allUsers.find(u => u.email && u.email.toLowerCase().trim() === normalizedNewEmail) || null;
    }
    
    // Only return error if the existing user is a DIFFERENT user
    // If it's the same user, allow it (they might be changing back to a previous email)
    if (existingUser) {
      const existingUserId = existingUser._id.toString();
      const currentUserId = user._id.toString();
      
      // If it's a different user, block it
      if (existingUserId !== currentUserId) {
        return res.status(400).json({ msg: 'Email already in use' });
      }
      // If it's the same user, allow it (they're changing back to their own email)
    }

    // Update email (use normalized email)
    user.email = normalizedNewEmail;
    user.accountUpdateOtp = undefined; // Clear OTP after use
    await user.save();

    res.json({ msg: 'Email updated successfully!', email: newEmail });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// 4. UPDATE PASSWORD
router.put('/account/update-password', auth, async (req, res) => {
  const { newPassword, otp } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Verify OTP - normalize both values to strings and trim whitespace
    const storedOtp = user.accountUpdateOtp ? String(user.accountUpdateOtp).trim() : '';
    const providedOtp = otp ? String(otp).trim() : '';
    
    if (!storedOtp || storedOtp !== providedOtp) {
      return res.status(400).json({ msg: 'Invalid or expired OTP' });
    }

    // Update password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.accountUpdateOtp = undefined; // Clear OTP after use
    await user.save();

    res.json({ msg: 'Password updated successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

export default router;