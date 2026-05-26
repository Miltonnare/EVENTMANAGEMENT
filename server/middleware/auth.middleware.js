const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const User = require('../models/User');
const { sendMessageResponse } = require('../utils/responseHelpers');

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return sendMessageResponse(res, 401, 'Not Authorized, no token');
  }

  let decoded;
  try {
    const token = authHeader.split(' ')[1];
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    console.error('Token verification failed:', error.message);
    return sendMessageResponse(res, 401, 'Not authorized,token failed');
  }

  req.user = await User.findById(decoded.id).select('-password');

  if (!req.user) {
    return sendMessageResponse(res, 401, 'User not found');
  }

  return next();
});

module.exports = protect;
