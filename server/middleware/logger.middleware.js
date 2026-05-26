const config = require('../config');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLine = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) {
      console.error(logLine);
    } else if (!config.isTest) {
      console.log(logLine);
    }
  });

  next();
};

module.exports = requestLogger;
