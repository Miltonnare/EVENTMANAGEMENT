const jwt = require('jsonwebtoken');
const config = require('../config');

const generateAccessToken = (user) =>
  jwt.sign(
    {
      id: user._id,
      role: user.role,
      tokenVersion: user.tokenVersion,
      type: 'access',
    },
    config.auth.accessSecret,
    { expiresIn: config.auth.accessExpiresIn }
  );

const verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, config.auth.accessSecret);
  if (decoded.type !== 'access') {
    throw new Error('Invalid token type');
  }
  return decoded;
};

module.exports = { generateAccessToken, verifyAccessToken };
