const { body } = require('express-validator');

const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').trim().notEmpty().withMessage('Phone is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('role')
    .optional()
    .isIn(['attendee', 'organizer'])
    .withMessage('Role must be attendee or organizer'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const emailValidator = [body('email').trim().isEmail().withMessage('Valid email is required')];

const verifyEmailValidator = [
  body('token').trim().notEmpty().withMessage('Verification token is required'),
];

const resetPasswordValidator = [
  body('token').trim().notEmpty().withMessage('Reset token is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

module.exports = {
  registerValidator,
  loginValidator,
  emailValidator,
  verifyEmailValidator,
  resetPasswordValidator,
};
