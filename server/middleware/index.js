const asyncHandler = require('./asyncHandler');
const protect = require('./auth.middleware');
const requestLogger = require('./logger.middleware');
const notFound = require('./notFound.middleware');
const errorHandler = require('./errorHandler.middleware');
const { handleValidationErrors } = require('./validate.middleware');

module.exports = {
  asyncHandler,
  protect,
  requestLogger,
  notFound,
  errorHandler,
  handleValidationErrors,
};
