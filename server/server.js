import express from 'express';
import mongoose from 'mongoose';
import postRouter from './postRouter';

// Setup
const db = mongoose.connect('mongodb://127.0.0.1:27017/reactBlog', { useNewUrlParser: true });
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/posts', postRouter);

// Listener
app.listen(port, () => console.log(`Listening on port ${port}`));