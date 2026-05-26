const { body, param } = require('express-validator');

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
];

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
      if (!value) return true;
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
];

const validateEventId = [
  param('id').isMongoId().withMessage('Invalid event ID format'),
];

const validateEventIdParam = [
  param('eventId').isMongoId().withMessage('Invalid event ID format'),
];

const validateEventInput = (req, res, next) => {
  if (req.method !== 'POST' && req.method !== 'PUT') {
    return next();
  }

  if (!req.body || typeof req.body !== 'object' || Object.keys(req.body).length === 0) {
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

  return next();
};

module.exports = {
  validateEvent,
  validateEventUpdate,
  validateEventId,
  validateEventIdParam,
  validateEventInput,
};
