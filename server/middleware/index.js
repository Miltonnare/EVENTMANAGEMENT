const asyncHandler = require('./asyncHandler');
const protect = require('./auth.middleware');
const authorize = require('./authorize.middleware');
const requestLogger = require('./logger.middleware');
const notFound = require('./notFound.middleware');
const errorHandler = require('./errorHandler.middleware');
const { handleValidationErrors } = require('./validate.middleware');

module.exports = {
  asyncHandler,
  protect,
  authorize,
  requestLogger,
  notFound,
  errorHandler,
  handleValidationErrors,
};
