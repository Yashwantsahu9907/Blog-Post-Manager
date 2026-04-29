require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/users', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
