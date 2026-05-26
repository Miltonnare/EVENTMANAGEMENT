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
  get auth() {
    return {
      accessSecret:
        process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
      accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      refreshMaxAgeMs:
        Number(process.env.JWT_REFRESH_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,
      bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 12,
      maxFailedAttempts: Number(process.env.MAX_FAILED_LOGIN_ATTEMPTS) || 5,
      lockDurationMs: Number(process.env.ACCOUNT_LOCK_DURATION_MS) || 15 * 60 * 1000,
      requireEmailVerification: process.env.REQUIRE_EMAIL_VERIFICATION !== 'false',
    };
  },
  get cookies() {
    return {
      refreshName: process.env.REFRESH_COOKIE_NAME || 'refreshToken',
      path: process.env.REFRESH_COOKIE_PATH || '/api/auth',
      sameSite: process.env.COOKIE_SAME_SITE || 'strict',
      secure: process.env.NODE_ENV === 'production',
      refreshMaxAge:
        Number(process.env.JWT_REFRESH_MAX_AGE_MS) || 7 * 24 * 60 * 60 * 1000,
    };
  },
  get email() {
    return {
      from: process.env.EMAIL_FROM || 'noreply@eventsphere.local',
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
      folder: process.env.CLOUDINARY_FOLDER || 'event-management-app/posters',
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
