const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // For handling file paths
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();

// CORS middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Middleware to parse incoming JSON
app.use(express.json());


// Authentication routes
app.use('/auth', authRoutes);

// MongoDB connection (updated to use current configuration options)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
