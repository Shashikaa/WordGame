const mongoose = require('mongoose');

// Define the UserScore schema
const userScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  score: { type: Number, required: true },
  level: { type: Number, required: true },
}, { timestamps: true });

// Create the UserScore model from the schema
const UserScore = mongoose.model('UserScore', userScoreSchema);

module.exports = UserScore;
