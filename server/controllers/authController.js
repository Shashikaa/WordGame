const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Register a new user (either via email/password or Google)
const register = async (req, res) => {
  const { username, email, password, googleId } = req.body;

  try {
    // If registering with Google (i.e. googleId is provided)
    if (googleId) {
      // Check if a user with this Google ID already exists
      const existingGoogleUser = await User.findOne({ googleId });
      if (existingGoogleUser) {
        return res.status(400).json({ message: 'User already exists with this Google account' });
      }

      // Create a new user with Google ID and no password
      const user = new User({ username, email, googleId });
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user });
    }

    // Otherwise, handle email/password registration
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save new user (no googleId here)
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in registration', error: error.message });
  }
};

// Login a user (either via email/password or Google)
const login = async (req, res) => {
  const { username, email, password, googleId } = req.body;

  try {
    // If logging in via Google
    if (googleId) {
      // Handle Google login
      const user = await User.findOne({ googleId });
      if (!user) {
        return res.status(400).json({ message: 'User not found with this Google account' });
      }

      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return res.json({ token, user });
    }

    // Otherwise, handle email/password login
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found with this email' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in login', error: error.message });
  }
};

module.exports = { register, login };
