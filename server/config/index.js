const dotenv = require('dotenv');

dotenv.config();

const config = {
  get env() {
    return process.env.NODE_ENV || 'development';
  },
  get port() {
    return process.env.PORT || 5000;
  },
  get mongoUri() {
    return process.env.MONGO_URI;
  },
  get jwt() {
    return {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    };
  },
  get clientUrl() {
    return process.env.CLIENT_URL;
  },
  get allowedOrigins() {
    return (process.env.ALLOWED_ORIGINS || '')
      .split(',')
      .map((url) => url.trim().replace(/\/$/, ''))
      .filter(Boolean);
  },
  get cloudinary() {
    return {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET,
    };
  },
  get isProduction() {
    return process.env.NODE_ENV === 'production';
  },
  get isTest() {
    return process.env.NODE_ENV === 'test';
  },
};

module.exports = config;
