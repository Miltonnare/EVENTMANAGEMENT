const asyncHandler = require('../middleware/asyncHandler');
const authService = require('../services/auth.service');
const ApiError = require('../utils/ApiError');
const {
  sendAuthResponse,
  sendMessageResponse,
  sendData,
} = require('../utils/responseHelpers');

const handleAuthError = (res, error) => {
  if (error instanceof ApiError) {
    return sendMessageResponse(res, error.statusCode, error.message);
  }
  return sendMessageResponse(res, 500, 'server error', { error: error.message });
};

const register = asyncHandler(async (req, res) => {
  try {
    const result = await authService.register(req.body);
    return sendAuthResponse(res, 201, result);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const result = await authService.login(req.body);
    return sendAuthResponse(res, 200, result);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const user = await authService.getProfile(req.user.id);
    return sendData(res, 200, user);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

module.exports = { register, login, getProfile };
