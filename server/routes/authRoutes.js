import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate all three fields are present
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if a user with that email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password using bcrypt (10 salt rounds)
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create and save a new User document
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    // Return 201 with success message and new user's id
    return res.status(201).json({
      message: 'User created successfully',
      userId: newUser._id,
    });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email and password are present
    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare the provided password against the stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT signed with JWT_SECRET, containing user's id, expiring in 7 days
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return 200 with success message, token, and user info (excluding password/hash)
    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
