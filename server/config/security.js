const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const createRateLimit = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            error: message
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            res.status(429).json({
                success: false,
                error: message,
                retryAfter: Math.round(windowMs / 1000)
            });
        }
    });
};


const generalLimiter = createRateLimit(
    15 * 60 * 1000, 
    100, 
    'Too many requests from this IP, please try again later.'
);


const authLimiter = createRateLimit(
    15 * 60 * 1000, // 15 minutes
    5, // 5 requests per window
    'Too many authentication attempts, please try again later.'
);

// File upload rate limiting
const uploadLimiter = createRateLimit(
    60 * 60 * 1000, 
    10, 
    'Too many file uploads, please try again later.'
);

// Security middleware configuration
const securityMiddleware = (app) => {
    
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
                fontSrc: ["'self'", "https://fonts.gstatic.com"],
                imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
                scriptSrc: ["'self'"],
                connectSrc: ["'self'"]
            }
        },
        crossOriginEmbedderPolicy: false
    }));

    
    app.use(mongoSanitize());

    // Data sanitization against XSS
    app.use(xss());

    // Prevent parameter pollution
    app.use(hpp());

    // Trust proxy for accurate IP addresses
    app.set('trust proxy', 1);
};

// File upload security validation
const validateFileUpload = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    // Check file size
    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB default
    if (req.file.size > maxSize) {
        return res.status(400).json({
            success: false,
            error: `File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`
        });
    }

    // Check file type
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif').split(',');
    const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExtension)) {
        return res.status(400).json({
            success: false,
            error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}.`
        });
    }

    // Check MIME type
    const allowedMimeTypes = [
        'image/jpeg',
        'image/jpg', 
        'image/png',
        'image/gif'
    ];
    
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid file MIME type. Only images are allowed.'
        });
    }

    next();
};

// Input validation middleware
const validateEventInput = (req, res, next) => {
    const { title, description, date, location, capacity } = req.body;

    // Sanitize string inputs
    if (title) req.body.title = title.trim();
    if (description) req.body.description = description.trim();
    if (location) req.body.location = location.trim();

    // Validate title
    if (title && (title.length < 3 || title.length > 100)) {
        return res.status(400).json({
            success: false,
            error: 'Title must be between 3 and 100 characters.'
        });
    }

    // Validate description
    if (description && (description.length < 10 || description.length > 2000)) {
        return res.status(400).json({
            success: false,
            error: 'Description must be between 10 and 2000 characters.'
        });
    }

    // Validate location
    if (location && (location.length < 3 || location.length > 200)) {
        return res.status(400).json({
            success: false,
            error: 'Location must be between 3 and 200 characters.'
        });
    }

    // Validate capacity
    if (capacity !== undefined && capacity !== null && capacity !== '') {
        const cap = parseInt(capacity);
        if (isNaN(cap) || cap < 1 || cap > 10000) {
            return res.status(400).json({
                success: false,
                error: 'Capacity must be a number between 1 and 10,000.'
            });
        }
        req.body.capacity = cap;
    }

    next();
};

module.exports = {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    securityMiddleware,
    validateFileUpload,
    validateEventInput
};
