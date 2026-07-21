const jwt = require('jsonwebtoken');
const protect = require('../middleware/auth.middleware');
const User = require('../models/User');
const { generateAccessToken } = require('../utils/token');

describe('Auth middleware', () => {
  const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('rejects requests without a token', async () => {
    const req = { headers: {}, cookies: {} };
    const res = createMockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Not Authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects requests with invalid tokens', async () => {
    const req = { headers: { authorization: 'Bearer badtoken' }, cookies: {} };
    const res = createMockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Not authorized,token failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches user when token is valid', async () => {
    const user = await User.create({
      name: 'Auth User',
      email: `auth_${Date.now()}@example.com`,
      phone: '1234567890',
      password: 'password123',
      role: 'attendee',
      isEmailVerified: true,
    });

    const token = generateAccessToken(user);

    const req = { headers: { authorization: `Bearer ${token}` }, cookies: {} };
    const res = createMockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(req.user).toBeTruthy();
    expect(req.user.email).toBe(user.email);
    expect(next).toHaveBeenCalledWith();
  });
});
