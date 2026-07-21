const config = require('../config');
const ApiError = require('../utils/ApiError');

const errorHandler = (error, req, res, next) => {
  if (!config.isTest) {
    console.error('Global error handler:', error);
  }

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      error: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  if (error.message && error.message.includes('CORS policy')) {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
      message: error.message,
    });
  }

  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: 'File too large',
      message: 'Maximum file size exceeded (limit 5MB)',
    });
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      message: errors[0] || 'Validation error',
      details: errors,
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'Invalid ID format',
      message: `Invalid ${error.path}: ${error.value}`,
    });
  }

  const statusCode = error.statusCode || error.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: config.isProduction ? 'Internal server error' : error.message || 'Internal server error',
    error: config.isProduction ? 'Internal server error' : error.message || 'Internal server error',
    ...(!config.isProduction && { stack: error.stack }),
  });
};

module.exports = errorHandler;
