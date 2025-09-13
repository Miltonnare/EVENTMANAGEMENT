const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const { xss } = require('express-xss-sanitizer');

// Custom NoSQL injection sanitization function
const sanitizeObject = (obj) => {
    if (obj === null || obj === undefined) {
        return obj;
    }
    
    if (typeof obj !== 'object') {
        return obj;
    }
    
    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }
    
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        // Remove MongoDB operators and potentially dangerous patterns
        if (key.startsWith('$') || key.startsWith('__') || 
            /\$where|\$eq|\$ne|\$gt|\$gte|\$lt|\$lte|\$in|\$nin|\$and|\$or|\$not|\$nor|\$exists|\$type|\$expr|\$jsonSchema|\$mod|\$regex|\$text|\$where|\$geoWithin|\$geoIntersects|\$near|\$nearSphere|\$all|\$elemMatch|\$size|\$bitsAllSet|\$bitsAnySet|\$bitsAllClear|\$bitsAnyClear|\$comment|\$meta|\$slice/.test(key)) {
            continue;
        }
        
        // Recursively sanitize nested objects
        sanitized[key] = sanitizeObject(value);
    }
    
    return sanitized;
};

// Rate limiting configurations
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5,
    message: {
        error: 'Too many authentication attempts from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const uploadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20,
    message: {
        error: 'Too many upload attempts from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Security middleware function
const securityMiddleware = (app) => {
    // Helmet for security headers
    app.use(helmet({
        crossOriginEmbedderPolicy: false,
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:", "blob:"],
            },
        },
    }));

    // Additional security headers
    app.use((req, res, next) => {
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-XSS-Protection', '1; mode=block');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        next();
    });

    // Custom NoSQL injection prevention
    app.use((req, res, next) => {
        try {
            // Sanitize request body
            if (req.body && typeof req.body === 'object') {
                req.body = sanitizeObject(req.body);
            }
            
            // Sanitize query parameters - SAFER APPROACH
            if (req.query && typeof req.query === 'object') {
                const sanitizedQuery = sanitizeObject(req.query);
                
                // Clear original query and assign sanitized values
                Object.keys(req.query).forEach(key => {
                    delete req.query[key];
                });
                Object.assign(req.query, sanitizedQuery);
            }
            
            // Sanitize URL parameters
            if (req.params && typeof req.params === 'object') {
                req.params = sanitizeObject(req.params);
            }
            
            next();
        } catch (error) {
            console.error('Sanitization error:', error);
            // Continue without sanitization rather than crashing
            next();
        }
    });

    // XSS protection - MUST COME AFTER BODY PARSING
    app.use(xss());
};

// File upload validation middleware
const validateFileUpload = (req, res, next) => {
    if (req.file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
            });
        }

        if (req.file.size > maxSize) {
            return res.status(400).json({
                success: false,
                error: 'File too large. Maximum size is 5MB.',
            });
        }
    }
    next();
};

// Event input validation middleware (updated to remove capacity requirement)
const validateEventInput = (req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT') {
     
        if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
            console.log('Request body is undefined or empty, skipping validation');
            return next(); 
        }

        const { title, description, date, location } = req.body;
        
        if (!title || title.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Title must be at least 3 characters long.',
            });
        }

        if (!description || description.trim().length < 10) {
            return res.status(400).json({
                success: false,
                error: 'Description must be at least 10 characters long.',
            });
        }

        if (!date || new Date(date) < new Date()) {
            return res.status(400).json({
                success: false,
                error: 'Event date must be in the future.',
            });
        }

        if (!location || location.trim().length < 3) {
            return res.status(400).json({
                success: false,
                error: 'Location must be at least 3 characters long.',
            });
        }

        
    }
    next();
};

module.exports = {
    generalLimiter,
    authLimiter,
    uploadLimiter,
    securityMiddleware,
    validateFileUpload,
    validateEventInput,
    sanitizeObject 
};