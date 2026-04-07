import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pool from './db';
import { projectsRouter } from './routes/projects';
import { tasksRouter } from './routes/tasks';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ──────────────────────────────────────────────────
app.use(express.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost: 5173',
  })
);

// ─── ROUTES ─────────────────────────────────────────────────────
app.use('/api/projects', projectsRouter);
app.use('/api', tasksRouter);

// ─── HEALTH CHECK ───────────────────────────────────────────────
// Enhanced from Level 1: now checks database connectivity too.
app.get('/api/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: 'connected',
      dbTime: result.rows[0].now,
    });
  } catch {
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      database: 'disconnected',
    });
  }
});

// ─── ERROR HANDLER ──────────────────────────────────────────────
// Must be registered AFTER all routes.
// Express knows it's an error handler because it has 4 parameters.
app.use(errorHandler);

// ─── START SERVER ──────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
