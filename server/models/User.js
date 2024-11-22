const mongoose = require('mongoose');

// Score Schema to store each user's score for different levels
const scoreSchema = new mongoose.Schema({
  score: { type: Number, required: true },
  level: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

// User Schema to store user information along with their scores
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true,sparse: true },
  scores: [scoreSchema], // Array to store multiple scores
});

const User = mongoose.model('User', userSchema);

module.exports = User;
