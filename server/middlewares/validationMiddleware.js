const { body, param, query, validationResult } = require('express-validator');

// Event creation/update validation
const validateEvent = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
        .withMessage('Title contains invalid characters'),
    
    body('description')
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    
    body('date')
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date')
        .custom((value) => {
            const date = new Date(value);
            if (date <= new Date()) {
                throw new Error('Event date must be in the future');
            }
            return true;
        }),
    
    body('location')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Location must be between 3 and 200 characters'),
    
    body('capacity')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('Capacity must be an integer between 1 and 10,000'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags && tags.length > 10) {
                throw new Error('Maximum 10 tags allowed');
            }
            if (tags) {
                for (const tag of tags) {
                    if (typeof tag !== 'string' || tag.length > 20) {
                        throw new Error('Each tag must be a string with maximum 20 characters');
                    }
                }
            }
            return true;
        })
];

// Event ID parameter validation
const validateEventId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid event ID format')
];

// Event update validation (all fields optional)
const validateEventUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters')
        .matches(/^[a-zA-Z0-9\s\-_.,!?()]+$/)
        .withMessage('Title contains invalid characters'),
    
    body('description')
        .optional()
        .trim()
        .isLength({ min: 10, max: 2000 })
        .withMessage('Description must be between 10 and 2000 characters'),
    
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid ISO 8601 date')
        .custom((value) => {
            const date = new Date(value);
            if (date <= new Date()) {
                throw new Error('Event date must be in the future');
            }
            return true;
        }),
    
    body('location')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Location must be between 3 and 200 characters'),
    
    body('capacity')
        .optional()
        .isInt({ min: 1, max: 10000 })
        .withMessage('Capacity must be an integer between 1 and 10,000'),
    
    body('status')
        .optional()
        .isIn(['active', 'cancelled', 'completed'])
        .withMessage('Status must be one of: active, cancelled, completed'),
    
    body('tags')
        .optional()
        .isArray()
        .withMessage('Tags must be an array')
        .custom((tags) => {
            if (tags && tags.length > 10) {
                throw new Error('Maximum 10 tags allowed');
            }
            if (tags) {
                for (const tag of tags) {
                    if (typeof tag !== 'string' || tag.length > 20) {
                        throw new Error('Each tag must be a string with maximum 20 characters');
                    }
                }
            }
            return true;
        })
];

// Query parameter validation for event listing
const validateEventQuery = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    
    query('sort')
        .optional()
        .isIn(['date', '-date', 'title', '-title', 'createdAt', '-createdAt'])
        .withMessage('Sort must be one of: date, -date, title, -title, createdAt, -createdAt'),
    
    query('status')
        .optional()
        .isIn(['active', 'cancelled', 'completed'])
        .withMessage('Status must be one of: active, cancelled, completed'),
    
    query('search')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Search term cannot exceed 100 characters')
];

// File upload validation
const validateFileUpload = [
    body('image')
        .optional()
        .custom((value, { req }) => {
            if (req.file) {
                const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!allowedTypes.includes(req.file.mimetype)) {
                    throw new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.');
                }
                
                const maxSize = 10 * 1024 * 1024; // 10MB
                if (req.file.size > maxSize) {
                    throw new Error('File too large. Maximum size is 10MB.');
                }
            }
            return true;
        })
];

// Validation result handler
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

module.exports = {
    validateEvent,
    validateEventId,
    validateEventUpdate,
    validateEventQuery,
    validateFileUpload,
    handleValidationErrors
};
