const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },  // Optional, only used for email/password login
    googleId: { type: String, unique: true, sparse: true }, // Google ID is unique only if provided
    profilePic: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);
module.exports = User;
