const jwt = require('jsonwebtoken');
const protect = require('../middlewares/authMiddleware');
const User = require('../models/User');

describe('Auth middleware', () => {
  const createMockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  it('rejects requests without a token', async () => {
    const req = { headers: {} };
    const res = createMockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not Authorized, no token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('rejects requests with invalid tokens', async () => {
    const req = { headers: { authorization: 'Bearer badtoken' } };
    const res = createMockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized,token failed' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches user when token is valid', async () => {
    const user = await User.create({
      name: 'Auth User',
      email: 'auth@example.com',
      phone: '1234567890',
      password: 'password123',
      role: 'attendee',
    });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = createMockRes();
    const next = jest.fn();

    await protect(req, res, next);

    expect(req.user).toBeTruthy();
    expect(req.user.email).toBe('auth@example.com');
    expect(next).toHaveBeenCalled();
  });
});
