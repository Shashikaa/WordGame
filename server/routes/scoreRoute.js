const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import the User model

// Fetch leaderboard (top 10 highest scores)
router.get('/leaderboard', async (req, res) => {
  try {
    // Fetch users sorted by their highest score (descending)
    const users = await User.find()
      .sort({ 'scores.score': -1 }) // Sort by score in descending order (highest first)
      .limit(10); // Limit to top 10 users

    if (!users.length) {
      return res.status(404).json({ message: 'No leaderboard data found' });
    }

    // Prepare leaderboard response (only top score for each user)
    const leaderboard = users.map((user) => ({
      username: user.username,
      score: user.scores.length ? Math.max(...user.scores.map((s) => s.score)) : 0, // Display the highest score or 0 if no scores
    }));

    return res.json(leaderboard); // Send the leaderboard data as JSON
  } catch (err) {
    console.error('Error fetching leaderboard:', err);
    return res.status(500).json({ message: 'Error fetching leaderboard' });
  }
});

// Route to save a new score (this might be used when a user finishes a game)
router.post('/', async (req, res) => {
  const { username, score, level } = req.body;

  // Check for missing fields
  if (!username || !score || !level) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Find the user and update their scores
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add new score to the user's scores array
    user.scores.push({ score, level });
    await user.save();

    res.status(201).json({ message: 'Score saved successfully', score: { score, level } });
  } catch (err) {
    console.error('Error saving score:', err);
    res.status(500).json({ message: 'Error saving score' });
  }
});

// Route to fetch the highest level achieved by a specific user
router.get('/level/:username', async (req, res) => {
  try {
    const { username } = req.params;

    // Find the user by username
    const user = await User.findOne({ username: new RegExp(`^${req.params.username}$`, 'i') });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Determine the highest level the user has achieved
    const highestLevel = user.scores.length ? Math.max(...user.scores.map((s) => s.level)) : 1;

    res.json({ username: user.username, highestLevel });
  } catch (err) {
    console.error('Error fetching user level:', err);
    res.status(500).json({ message: 'Error fetching user level' });
  }
});

module.exports = router;
