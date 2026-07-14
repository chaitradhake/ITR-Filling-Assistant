import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taxRouter from './routes/taxRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import authRouter from './routes/authRoutes.js';
import calculationRouter from './routes/calculationRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'https://itr-filling-assistant.vercel.app']
}));

app.use(express.json());
app.use('/api', taxRouter);
app.use('/api', uploadRouter);
app.use('/api/auth', authRouter);
app.use('/api/calculations', calculationRouter);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

