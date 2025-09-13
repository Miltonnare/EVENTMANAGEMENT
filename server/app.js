const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/event');
const eventRegRoutes = require('./routes/registration');

// Security middleware
const {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    securityMiddleware,
    validateFileUpload,
    validateEventInput
} = require('./config/security');

const app = express();

// Apply security middleware first
securityMiddleware(app);

// Apply rate limiting
app.use('/api/', generalLimiter);
app.use('/api/auth', authLimiter);
app.use('/api/events', uploadLimiter);

// Body parsing middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration with enhanced security
app.use(cors({
    origin: function (origin, callback) {
        const allowedOriginsString = process.env.ALLOWED_ORIGINS || ''; 
        const allowedOrigins = allowedOriginsString.split(',').map(url => url.trim().replace(/\/$/, ''));

        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        const normalizedOrigin = origin.replace(/\/$/, '');
        
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        } else {
            const msg = `The CORS policy for this site does not allow access from the origin: ${origin}. Allowed: ${allowedOriginsString}`;
            return callback(new Error(msg), false);
        }
    },
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400 // 24 hours
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use('/api/auth', authRoutes);
app.use('/api/events', validateEventInput, eventsRoutes);
app.use('/api/eventRegistration', eventRegRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Events APP Running Successfully',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});


app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error('Global error handler:', error);
    
    // Handle CORS errors
    if (error.message.includes('CORS policy')) {
        return res.status(403).json({
            success: false,
            error: 'CORS policy violation',
            message: error.message
        });
    }
    
    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            error: 'File too large',
            message: 'Maximum file size exceeded'
        });
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            success: false,
            error: 'Validation error',
            details: errors
        });
    }
    
    // Default error response
    res.status(error.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : error.message,
        ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
    });
});

module.exports = app;