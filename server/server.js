import express from 'express';
import dotenv from 'dotenv';
import taxRouter from './routes/taxRoutes.js';
import uploadRouter from './routes/uploadRoutes.js';
import { connectDB } from './config/db.js';

dotenv.config();

// Connect to database
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api', taxRouter);
app.use('/api', uploadRouter);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
