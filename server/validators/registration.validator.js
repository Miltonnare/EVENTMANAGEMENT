const { param } = require('express-validator');

const eventIdParamValidator = [
  param('eventId').isMongoId().withMessage('Invalid event ID format'),
];

module.exports = { eventIdParamValidator };
