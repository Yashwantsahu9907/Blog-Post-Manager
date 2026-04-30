require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

const allowedOrigins = ['http://localhost:5173'];
if (process.env.FRONTEND_URL) {
    // Automatically strip trailing slash if user accidentally included it
    const cleanUrl = process.env.FRONTEND_URL.replace(/\/$/, '');
    allowedOrigins.push(cleanUrl);
}

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const path = require('path');

app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Serve frontend static files
// This assumes your React app is built into the frontend/dist folder
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// Catch-all route for SPA routing
// Any request that doesn't match an API route will return the React index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
