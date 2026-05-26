const asyncHandler = require('./asyncHandler');
const { sendMessageResponse } = require('../utils/responseHelpers');

const authorize =
  (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return sendMessageResponse(res, 401, 'Not Authorized, no token');
    }

    if (!roles.includes(req.user.role)) {
      return sendMessageResponse(res, 403, 'Not authorized for this action');
    }

    return next();
  });

module.exports = authorize;
