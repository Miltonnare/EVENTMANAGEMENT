const User = require('../models/User');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/jwt');

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

const register = async ({ name, email, password, phone, role }) => {
  if (!name || !email || !phone || !password) {
    throw new ApiError(400, 'All fields are required');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, 'Email already used');
  }

  const user = await User.create({ name, email, phone, password, role });

  return {
    message: 'User created succesfully',
    token: generateToken(user),
    user: formatUser(user),
  };
};

const login = async ({ email, password }) => {
  if (!email || !password) {
    throw new ApiError(400, 'Email and Password are required');
  }

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(400, 'Invalid Credentials');
  }

  return {
    message: 'Login successful',
    token: generateToken(user),
    user: formatUser(user),
  };
};

const getProfile = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw new ApiError(400, 'User not found ');
  }

  return user;
};

module.exports = { register, login, getProfile };
