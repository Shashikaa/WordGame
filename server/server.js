const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const scoreRoute = require('./routes/scoreRoute');

dotenv.config();  // Load environment variables

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000',  // React app URL
  credentials: true,  // Allow cookies or authentication headers
}));

// Middleware to parse incoming JSON
app.use(express.json());

// Routes
app.use('/auth', authRoutes);  // Authentication routes
app.use('/api/scores', scoreRoute);  // Score-related routes

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);  // Exit process if connection fails
  });

// Handle 404 for unknown API routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(`Internal Server Error: ${err.stack}`);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
