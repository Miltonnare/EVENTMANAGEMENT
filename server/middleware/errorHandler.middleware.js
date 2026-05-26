const config = require('../config');
const ApiError = require('../utils/ApiError');

const errorHandler = (error, req, res, next) => {
  console.error('Global error handler:', error);

  if (error instanceof ApiError) {
    const payload = { message: error.message };
    if (error.details) {
      payload.error = error.details;
    }
    return res.status(error.statusCode).json(payload);
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
      message: 'Maximum file size exceeded',
    });
  }

  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: errors,
    });
  }

  res.status(error.status || 500).json({
    success: false,
    error: config.isProduction ? 'Internal server error' : error.message,
    ...(!config.isProduction && { stack: error.stack }),
  });
};

module.exports = errorHandler;
