const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error(err));

// Routes
const authRoutes = require('./routes/authRoutes');
const activityRoutes = require('./routes/activityRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);

app.get('/', (req, res) => {
    res.send('Volunteer Hub API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
