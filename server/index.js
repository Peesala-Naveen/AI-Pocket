import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import aiModelRoutes from './routes/aiModelRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security & Parsing Middleware ──────────────────────────────────────────
app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/$/, '') : null
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      // Remove trailing slash if present
      const normalizedOrigin = origin.replace(/\/$/, '');
      const isAllowed = allowedOrigins.some(allowed => normalizedOrigin === allowed) || normalizedOrigin.endsWith('.vercel.app');
      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200, // standard success status code for preflight OPTIONS requests
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/models', aiModelRoutes);

/**
 * @route   GET /
 * @desc    API health check & endpoint directory
 */
app.get('/', (_req, res) => {
  res.status(200).json({
    message: 'AI Pocket API',
    version: '1.0.0',
    endpoints: {
      models: '/api/models',
      search: '/api/models/search?q=query',
    },
  });
});

// ─── 404 Handler ────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// ─── Global Error Handler ───────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(`\x1b[31m[Error]\x1b[0m ${err.stack || err.message}`);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ─── Start Server ───────────────────────────────────────────────────────────
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(
      `\x1b[35m[Server]\x1b[0m \x1b[32mRunning\x1b[0m on \x1b[33mhttp://localhost:${PORT}\x1b[0m  (${process.env.NODE_ENV || 'development'})`
    );
  });

  // ─── Graceful Shutdown ──────────────────────────────────────────────────
  const shutdown = (signal) => {
    console.log(`\n\x1b[35m[Server]\x1b[0m Received ${signal}. Shutting down gracefully…`);
    server.close(async () => {
      const { pool } = await import('./config/db.js');
      await pool.end();
      console.log('\x1b[35m[Server]\x1b[0m Postgres connection pool closed. Goodbye 👋');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
});
