const asyncHandler = require('../middleware/asyncHandler');
const authService = require('../services/auth.service');
const ApiError = require('../utils/ApiError');
const {
  sendAuthResponse,
  sendMessageResponse,
  sendData,
} = require('../utils/responseHelpers');
const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/cookies');
const config = require('../config');

const requestMeta = (req) => ({
  userAgent: req.get('user-agent'),
  ipAddress: req.ip,
});

const handleAuthError = (res, error) => {
  if (error instanceof ApiError) {
    return sendMessageResponse(res, error.statusCode, error.message);
  }
  return sendMessageResponse(res, 500, 'server error', { error: error.message });
};

const sendAuthResult = (res, statusCode, result) => {
  if (result.refreshToken) {
    setRefreshTokenCookie(res, result.refreshToken);
    const { refreshToken, ...payload } = result;
    return sendAuthResponse(res, statusCode, payload);
  }
  return sendAuthResponse(res, statusCode, result);
};

const register = asyncHandler(async (req, res) => {
  try {
    const result = await authService.register(req.body, requestMeta(req));
    const statusCode = result.token ? 201 : 201;
    return sendAuthResult(res, statusCode, result);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const login = asyncHandler(async (req, res) => {
  try {
    const result = await authService.login(req.body, requestMeta(req));
    return sendAuthResult(res, 200, result);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const refresh = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies[config.cookies.refreshName];
    const result = await authService.refreshAccessToken(refreshToken, requestMeta(req));
    return sendAuthResult(res, 200, result);
  } catch (error) {
    clearRefreshTokenCookie(res);
    return handleAuthError(res, error);
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies[config.cookies.refreshName];
    const result = await authService.logout(refreshToken);
    clearRefreshTokenCookie(res);
    return sendMessageResponse(res, 200, result.message);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const logoutAll = asyncHandler(async (req, res) => {
  try {
    const result = await authService.logoutAllDevices(req.user._id);
    clearRefreshTokenCookie(res);
    return sendMessageResponse(res, 200, result.message);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const getProfile = asyncHandler(async (req, res) => {
  try {
    const user = await authService.getProfile(req.user._id);
    const profile = user.toObject();
    delete profile.password;
    return sendData(res, 200, profile);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const token = req.body.token || req.query.token;
    const result = await authService.verifyEmail(token);
    return sendMessageResponse(res, 200, result.message);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const resendVerification = asyncHandler(async (req, res) => {
  try {
    const result = await authService.resendVerification(req.body.email);
    return sendMessageResponse(res, 200, result.message);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body.email);
    return sendMessageResponse(res, 200, result.message);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    return sendMessageResponse(res, 200, result.message);
  } catch (error) {
    return handleAuthError(res, error);
  }
});

module.exports = {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  getProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
