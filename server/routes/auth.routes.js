const express = require('express');
const {
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
} = require('../controllers/authController');
const protect = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validate.middleware');
const {
  registerValidator,
  loginValidator,
  emailValidator,
  verifyEmailValidator,
  resetPasswordValidator,
} = require('../validators/auth.validator');

const router = express.Router();

router.post('/register', registerValidator, handleValidationErrors, register);
router.post('/login', loginValidator, handleValidationErrors, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/forgot-password', emailValidator, handleValidationErrors, forgotPassword);
router.post('/reset-password', resetPasswordValidator, handleValidationErrors, resetPassword);
router.post('/verify-email', verifyEmailValidator, handleValidationErrors, verifyEmail);
router.get('/verify-email', verifyEmail);
router.post(
  '/resend-verification',
  emailValidator,
  handleValidationErrors,
  resendVerification
);

router.get('/profile', protect, getProfile);
router.post('/logout-all', protect, logoutAll);

module.exports = router;
