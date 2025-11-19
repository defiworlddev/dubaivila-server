import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

import authRoutes from './routes/auth.js';
import estateRoutes from './routes/estate.js';
import agentsRoutes from './routes/agents.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dubaivilas';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/estate', estateRoutes);
app.use('/api/agents', agentsRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
