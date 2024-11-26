// routes/auth.js

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const auth = require('../middleware/auth');


const router = express.Router();
const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

// JWT generation function
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register (Email/Password)
router.post('/register', async (req, res) => {
  const { email, username, password } = req.body;

  try {
    // Validate input
    if (!email || !username || !password) {
      return res.status(400).json({ message: 'Email, username, and password are required' });
    }

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email or username already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);  // Hashing the password

    // Create and save new user without googleId for email/password registration
    const user = new User({
      email,
      username,
      password: hashedPassword,  // Saving the hashed password
      googleId: null,  // For email/password registration, googleId is null
    });

    await user.save();  // Save user to database

    // Generate JWT token
    const token = generateToken(user);
    res.status(201).json({ message: 'User registered successfully', token, user });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration', error: error.message });
  }
});


// Login (Username/Password)
router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user exists by username or email
    const user = await User.findOne({ $or: [{ username }, { email }] });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error during login', error: error.message });
  }
});

// Google Register (Google Login or Register)
router.post('/google-register', async (req, res) => {
  const { token } = req.body;
  try {
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const { email, name, sub: googleId } = ticket.getPayload();

    // Check if the user already exists
    let user = await User.findOne({ googleId });
    if (user) {
      return res.status(400).json({ message: 'User already registered with this Google account' });
    }

    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    user = new User({ email, username: name, googleId });
    await user.save();

    const jwtToken = generateToken(user);
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error("Google registration error:", error.message);
    res.status(500).json({ message: "Error with Google registration", error: error.message });
  }
});


// Google Login (for existing users)
router.post('/google-login', async (req, res) => {
  const { token } = req.body;
  try {
    // Verify the token with Google
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    });
    const { email, sub: googleId } = ticket.getPayload();

    // Check if the user exists with the Google ID
    const user = await User.findOne({ googleId });
    if (!user) {
      return res.status(400).json({ message: 'User not found with this Google account' });
    }

    // Generate JWT token
    const jwtToken = generateToken(user);
    res.json({ token: jwtToken, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error with Google login', error: error.message });
  }
});



// Fetch user profile
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password field
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// Update user profile
router.put('/user', auth, async (req, res) => {
  const { username, bio } = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, bio },
      { new: true, select: '-password' } // Exclude password field in the response
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
});

module.exports = router;
