// ============================================================
//  EduSphere Backend Server
//  Online Course Management System
//  AWT Project - MERN Stack
// ============================================================

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const colors = require('colors');
const path = require('path');

// Load environment variables FIRST before anything else
dotenv.config();
const env = require('./config/env');

// Database connection
const connectDB = require('./config/db');

// Route files
const authRoutes = require('./routes/auth.routes');
const courseRoutes = require('./routes/course.routes');
const enrollmentRoutes = require('./routes/enrollment.routes');
const userRoutes = require('./routes/user.routes');

// Error handler middleware
const errorHandler = require('./middleware/error.middleware');

// ─── Connect to MongoDB ────────────────────────────────────
connectDB();

// ─── Initialize Express ────────────────────────────────────
const app = express();

// ─── Security Middleware ───────────────────────────────────

// Set security HTTP headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate limiting — max 100 requests per 10 minutes per IP
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 10 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limit for auth routes — prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 20,
  message: {
    success: false,
    error: 'Too many login attempts. Please try again after 15 minutes.',
  },
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Sanitize data — prevent MongoDB operator injection ($where, $gt etc.)
app.use(mongoSanitize());

// ─── Core Middleware ───────────────────────────────────────

// Enable CORS for React frontend
app.use(cors({
  origin: env.clientUrl,
  credentials: true,                // Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser — parse incoming JSON requests
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// HTTP request logger (only in development)
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// ─── Static Files ─────────────────────────────────────────
// Serve uploaded files from the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── API Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/users', userRoutes);

// ─── Root Health Check Route ───────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🎓 EduSphere API is running!',
    version: '1.0.0',
    environment: env.nodeEnv,
    endpoints: {
      auth: '/api/auth',
      courses: '/api/courses',
      enrollments: '/api/enrollments',
      users: '/api/users',
    },
  });
});

// ─── API Health Check ──────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// ─── 404 Handler — Unmatched routes ───────────────────────
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route '${req.originalUrl}' not found on this server.`,
  });
});

// ─── Global Error Handler ──────────────────────────────────
// Must be LAST middleware — catches all errors passed via next(error)
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────
const PORT = env.port;

const server = app.listen(PORT, () => {
  console.log('\n');
  console.log('═'.repeat(50).cyan);
  console.log(`  🎓 EduSphere Server`.green.bold);
  console.log('═'.repeat(50).cyan);
  console.log(`  ✅ Status:      Running`.green);
  console.log(`  🌐 Port:        ${PORT}`.white);
  console.log(`  🔧 Mode:        ${env.nodeEnv}`.white);
  console.log(`  🔗 URL:         http://localhost:${PORT}`.white);
  console.log(`  📡 API Base:    http://localhost:${PORT}/api`.white);
  console.log('═'.repeat(50).cyan);
  console.log('\n');
});

// ─── Handle Unhandled Promise Rejections ──────────────────
// e.g. MongoDB connection failure after startup
process.on('unhandledRejection', (err) => {
  console.error(`\n❌ Unhandled Rejection: ${err.message}`.red.bold);
  console.error(err.stack);
  // Gracefully close server and exit
  server.close(() => {
    console.log('Server closed.'.yellow);
    process.exit(1);
  });
});

// ─── Handle Uncaught Exceptions ───────────────────────────
process.on('uncaughtException', (err) => {
  console.error(`\n❌ Uncaught Exception: ${err.message}`.red.bold);
  console.error(err.stack);
  process.exit(1);
});

module.exports = app;
