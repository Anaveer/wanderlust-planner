const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Import Routes
const tripRoutes = require('./routes/tripRoutes');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/api/trips', tripRoutes);
app.use('/api/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected Successfully!'))
    .catch((err) => {
        console.log('❌ Connection Failed!');
        console.log('Error Message:', err.message);
    });

// Default Route
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});