const request = require('supertest');
const app = require('../app');

const baseUser = {
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  password: 'password123',
  role: 'attendee',
};

describe('Auth routes', () => {
  it('registers a user and returns a token', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send(baseUser);

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user).toMatchObject({
      name: baseUser.name,
      email: baseUser.email,
      role: baseUser.role,
    });
  });

  it('rejects duplicate registrations', async () => {
    await request(app).post('/api/auth/register').send(baseUser);

    const response = await request(app)
      .post('/api/auth/register')
      .send(baseUser);

    expect(response.status).toBe(409);
    expect(response.body.message).toBe('Email already used');
  });

  it('logs in a registered user', async () => {
    await request(app).post('/api/auth/register').send(baseUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: baseUser.email, password: baseUser.password });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
    expect(response.body.user.email).toBe(baseUser.email);
  });

  it('rejects invalid credentials', async () => {
    await request(app).post('/api/auth/register').send(baseUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: baseUser.email, password: 'wrong' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid Credentials');
  });

  it('returns the current user profile when authorized', async () => {
    const register = await request(app).post('/api/auth/register').send(baseUser);
    const token = register.body.token;

    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.email).toBe(baseUser.email);
    expect(response.body.password).toBeUndefined();
  });
});
