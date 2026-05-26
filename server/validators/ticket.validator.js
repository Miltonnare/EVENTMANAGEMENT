const { body, param } = require('express-validator');

const eventIdParam = [param('eventId').isMongoId().withMessage('Invalid event ID')];

const typeIdParam = [
  param('typeId').isMongoId().withMessage('Invalid ticket type ID'),
];

const createTicketTypeValidator = [
  body('name').trim().notEmpty().withMessage('Ticket name is required'),
  body('category')
    .isIn(['free', 'paid', 'vip', 'early_bird'])
    .withMessage('Category must be free, paid, vip, or early_bird'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be 0 or greater'),
  body('quantity')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('Quantity must be a positive integer'),
  body('salesCloseDate')
    .optional({ nullable: true })
    .isISO8601()
    .withMessage('Sales close date must be valid'),
];

const purchaseValidator = [
  body('eventId').isMongoId().withMessage('Valid event ID is required'),
  body('ticketTypeId').isMongoId().withMessage('Valid ticket type ID is required'),
  body('quantity')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Quantity must be between 1 and 10'),
];

const ticketIdParam = [param('ticketId').isMongoId().withMessage('Invalid ticket ID')];

module.exports = {
  eventIdParam,
  typeIdParam,
  createTicketTypeValidator,
  purchaseValidator,
  ticketIdParam,
};
