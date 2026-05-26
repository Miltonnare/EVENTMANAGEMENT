const request = require('supertest');
const app = require('../app');

const baseUser = {
  name: 'Security User',
  email: 'security@example.com',
  phone: '1234567890',
  password: 'password123',
  role: 'attendee',
};

const registerAndLogin = async (agent) => {
  await agent.post('/api/auth/register').send(baseUser);
  return agent.post('/api/auth/login').send({
    email: baseUser.email,
    password: baseUser.password,
  });
};

describe('Auth security features', () => {
  it('issues refresh token cookie on login', async () => {
    await request(app).post('/api/auth/register').send(baseUser);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: baseUser.email, password: baseUser.password });

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeTruthy();
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('refreshToken=')])
    );
  });

  it('refreshes access token using refresh cookie', async () => {
    const agent = request.agent(app);
    const login = await registerAndLogin(agent);

    expect(login.body.token).toBeTruthy();

    const refresh = await agent.post('/api/auth/refresh').send();

    expect(refresh.status).toBe(200);
    expect(refresh.body.accessToken).toBeTruthy();
  });

  it('locks account after repeated failed logins', async () => {
    await request(app).post('/api/auth/register').send({
      ...baseUser,
      email: 'locked@example.com',
    });

    for (let i = 0; i < 5; i += 1) {
      await request(app)
        .post('/api/auth/login')
        .send({ email: 'locked@example.com', password: 'wrong-password' });
    }

    const locked = await request(app)
      .post('/api/auth/login')
      .send({ email: 'locked@example.com', password: 'wrong-password' });

    expect(locked.status).toBe(423);
  });

  it('logs out and invalidates refresh cookie', async () => {
    const agent = request.agent(app);
    await registerAndLogin(agent);

    const logout = await agent.post('/api/auth/logout').send();
    expect(logout.status).toBe(200);

    const refresh = await agent.post('/api/auth/refresh').send();
    expect(refresh.status).toBe(401);
  });

  it('logs out from all devices by incrementing token version', async () => {
    const agent = request.agent(app);
    const login = await registerAndLogin(agent);
    const accessToken = login.body.token;

    await agent.post('/api/auth/logout-all').set('Authorization', `Bearer ${accessToken}`).send();

    const profile = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(profile.status).toBe(401);
  });
});
