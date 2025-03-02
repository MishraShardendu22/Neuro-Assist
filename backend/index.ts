import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express from 'express';
import rateLimit from 'express-rate-limit';
import connectDatabase from './database/connect.database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOption = {
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
};

// Rate Limiting
const limiter = rateLimit({
  max: 5000,
  statusCode: 429,
  legacyHeaders: false,
  standardHeaders: true,
  windowMs: 15 * 60 * 1000,
  message: { error: 'Too many requests, please try again later.' },
});

app.use(morgan('dev'));
app.use(express.json());
app.use(cors(corsOption));
app.use(express.urlencoded({ extended: true }));

app.use('/api', limiter);

import { AllRouter } from './routes/index';
app.use('/api', AllRouter);

app.get('/test1234', (req, res) => {
  res.send('Backend is running!');
});

app.listen(PORT, () => {
  connectDatabase();
  console.log(`Server running on port ${PORT}`);
});
