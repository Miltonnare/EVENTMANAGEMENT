const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const apiRoutes = require('./routes');
const requestLogger = require('./middleware/logger.middleware');
const notFound = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/errorHandler.middleware');
const {
  generalLimiter,
  authLimiter,
  uploadLimiter,
  securityMiddleware,
} = require('./config/security');

const app = express();

app.set('trust proxy', 1);

app.use(requestLogger);

app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/events', uploadLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);

      const normalizedOrigin = origin.replace(/\/$/, '');

      if (config.allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      const allowedOriginsString = process.env.ALLOWED_ORIGINS || '';
      const msg = `The CORS policy for this site does not allow access from the origin: ${origin}. Allowed: ${allowedOriginsString}`;
      return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400,
  })
);

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
    },
  })
);

securityMiddleware(app);

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Events APP Running Successfully',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
