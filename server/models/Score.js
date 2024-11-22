// models/Score.js
const mongoose = require('mongoose');

const scoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;
