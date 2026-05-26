const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const { verifyAccessToken } = require('../utils/token');
const { sendMessageResponse } = require('../utils/responseHelpers');
const config = require('../config');

const extractAccessToken = (req) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    return authHeader.split(' ')[1];
  }
  if (req.cookies?.accessToken) {
    return req.cookies.accessToken;
  }
  return null;
};

const protect = asyncHandler(async (req, res, next) => {
  const token = extractAccessToken(req);

  if (!token) {
    return sendMessageResponse(res, 401, 'Not Authorized, no token');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return sendMessageResponse(res, 401, 'Not authorized,token failed');
  }

  const user = await User.findById(decoded.id);

  if (!user) {
    return sendMessageResponse(res, 401, 'User not found');
  }

  if (user.isLocked()) {
    return sendMessageResponse(res, 423, 'Account is locked. Try again later.');
  }

  if (decoded.tokenVersion !== user.tokenVersion) {
    return sendMessageResponse(res, 401, 'Session expired. Please log in again.');
  }

  if (config.auth.requireEmailVerification && !user.isEmailVerified) {
    return sendMessageResponse(res, 403, 'Please verify your email before accessing this resource');
  }

  req.user = user;
  return next();
});

module.exports = protect;
