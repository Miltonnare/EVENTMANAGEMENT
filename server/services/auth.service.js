const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateAccessToken } = require('../utils/token');
const { hashToken, generateSecureToken } = require('../utils/crypto');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./email.service');
const sessionService = require('./session.service');
const config = require('../config');

const VERIFICATION_EXPIRY_MS = 24 * 60 * 60 * 1000;
const RESET_EXPIRY_MS = 60 * 60 * 1000;

const shouldAutoVerify = () => config.isTest || !config.auth.requireEmailVerification;

const resolveRole = (role) => {
  if (role === 'organizer') return 'organizer';
  return 'attendee';
};

const buildAuthPayload = (user, accessToken) => ({
  message: 'Login successful',
  token: accessToken,
  accessToken,
  user: user.toSafeJSON(),
});

const issueAuthSession = async (user, meta) => {
  const accessToken = generateAccessToken(user);
  const { refreshToken } = await sessionService.createSession(user._id, meta);
  return { ...buildAuthPayload(user, accessToken), refreshToken };
};

const register = async ({ name, email, password, phone, role }, meta = {}) => {
  if (!name || !email || !phone || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(409, 'Email already used');
  }

  const verificationToken = generateSecureToken();
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role: resolveRole(role),
    isEmailVerified: shouldAutoVerify(),
    emailVerificationTokenHash: shouldAutoVerify() ? undefined : hashToken(verificationToken),
    emailVerificationExpires: shouldAutoVerify()
      ? undefined
      : new Date(Date.now() + VERIFICATION_EXPIRY_MS),
  });

  if (!shouldAutoVerify()) {
    await sendVerificationEmail(user, verificationToken);
    return {
      message:
        'User created succesfully. Please check your email to verify your account before logging in.',
      user: user.toSafeJSON(),
    };
  }

  const auth = await issueAuthSession(user, meta);
  return {
    message: 'User created succesfully',
    ...auth,
  };
};

const handleFailedLogin = async (user) => {
  user.failedLoginAttempts += 1;

  if (user.failedLoginAttempts >= config.auth.maxFailedAttempts) {
    user.lockUntil = new Date(Date.now() + config.auth.lockDurationMs);
    user.failedLoginAttempts = 0;
  }

  await user.save({ validateBeforeSave: false });
};

const login = async ({ email, password }, meta = {}) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and Password are required');
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Invalid Credentials');
  }

  if (user.isLocked()) {
    throw new ApiError(
      423,
      'Account locked due to too many failed login attempts. Try again later.'
    );
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    await handleFailedLogin(user);
    throw new ApiError(400, 'Invalid Credentials');
  }

  if (config.auth.requireEmailVerification && !user.isEmailVerified) {
    throw new ApiError(403, 'Please verify your email before logging in');
  }

  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  await user.save({ validateBeforeSave: false });

  const auth = await issueAuthSession(user, meta);
  return {
    message: 'Login successful',
    ...auth,
  };
};

const refreshAccessToken = async (refreshToken, meta = {}) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token not found');
  }

  const session = await sessionService.findValidSession(refreshToken);
  if (!session) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }

  const user = await User.findById(session.user);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  if (user.isLocked()) {
    throw new ApiError(423, 'Account is locked');
  }

  const { refreshToken: newRefreshToken } = await sessionService.rotateSession(session, meta);
  const accessToken = generateAccessToken(user);

  return {
    message: 'Token refreshed',
    token: accessToken,
    accessToken,
    refreshToken: newRefreshToken,
    user: user.toSafeJSON(),
  };
};

const logout = async (refreshToken) => {
  if (refreshToken) {
    await sessionService.revokeSessionByToken(refreshToken);
  }
  return { message: 'Logged out successfully' };
};

const logoutAllDevices = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.tokenVersion += 1;
  await user.save({ validateBeforeSave: false });
  await sessionService.revokeAllUserSessions(userId);

  return { message: 'Logged out from all devices successfully' };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(400, 'User not found ');
  }
  return user;
};

const verifyEmail = async (token) => {
  if (!token) {
    throw new ApiError(400, 'Verification token is required');
  }

  const user = await User.findOne({
    emailVerificationTokenHash: hashToken(token),
    emailVerificationExpires: { $gt: new Date() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired verification token');
  }

  user.isEmailVerified = true;
  user.emailVerificationTokenHash = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  return { message: 'Email verified successfully' };
};

const resendVerification = async (email) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { message: 'If that email exists, a verification link has been sent' };
  }

  if (user.isEmailVerified) {
    throw new ApiError(400, 'Email is already verified');
  }

  const verificationToken = generateSecureToken();
  user.emailVerificationTokenHash = hashToken(verificationToken);
  user.emailVerificationExpires = new Date(Date.now() + VERIFICATION_EXPIRY_MS);
  await user.save({ validateBeforeSave: false });
  await sendVerificationEmail(user, verificationToken);

  return { message: 'If that email exists, a verification link has been sent' };
};

const forgotPassword = async (email) => {
  if (!email) {
    throw new ApiError(400, 'Email is required');
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return { message: 'If that email exists, a password reset link has been sent' };
  }

  const resetToken = generateSecureToken();
  user.passwordResetTokenHash = hashToken(resetToken);
  user.passwordResetExpires = new Date(Date.now() + RESET_EXPIRY_MS);
  await user.save({ validateBeforeSave: false });
  await sendPasswordResetEmail(user, resetToken);

  return { message: 'If that email exists, a password reset link has been sent' };
};

const resetPassword = async ({ token, password }) => {
  if (!token || !password) {
    throw new ApiError(400, 'Token and new password are required');
  }

  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  const user = await User.findOne({
    passwordResetTokenHash: hashToken(token),
    passwordResetExpires: { $gt: new Date() },
  }).select('+password');

  if (!user) {
    throw new ApiError(400, 'Invalid or expired reset token');
  }

  user.password = password;
  user.passwordResetTokenHash = undefined;
  user.passwordResetExpires = undefined;
  user.failedLoginAttempts = 0;
  user.lockUntil = undefined;
  user.tokenVersion += 1;
  await user.save();
  await sessionService.revokeAllUserSessions(user._id);

  return { message: 'Password reset successful. Please log in with your new password.' };
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  logout,
  logoutAllDevices,
  getProfile,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};
