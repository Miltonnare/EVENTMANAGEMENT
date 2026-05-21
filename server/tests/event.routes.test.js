jest.mock('../config/cloudinary', () => ({
  upload: {
    single: () => (req, res, next) => next(),
  },
  handleUploadError: (err, req, res, next) => next(err),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(() => Promise.resolve('data:image/png;base64,QR_CODE')),
}));

jest.mock('cloudinary', () => ({
  v2: {
    uploader: {
      destroy: jest.fn(() => Promise.resolve()),
    },
  },
}));

const request = require('supertest');
const app = require('../app');

const createOrganizer = async () => {
  const payload = {
    name: 'Organizer',
    email: `organizer_${Date.now()}@example.com`,
    phone: '1234567890',
    password: 'password123',
    role: 'organizer',
  };
  const response = await request(app).post('/api/auth/register').send(payload);
  return { token: response.body.token, user: response.body.user };
};

const createAttendee = async () => {
  const payload = {
    name: 'Attendee',
    email: `attendee_${Date.now()}@example.com`,
    phone: '1234567890',
    password: 'password123',
    role: 'attendee',
  };
  const response = await request(app).post('/api/auth/register').send(payload);
  return { token: response.body.token, user: response.body.user };
};

describe('Event routes', () => {
  it('rejects event creation with missing fields', async () => {
    const { token } = await createOrganizer();

    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({ description: 'Missing title', location: 'Nairobi' });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it('creates an event with a QR code', async () => {
    const { token } = await createOrganizer();
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const response = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Tech Meetup',
        description: 'Great event for developers',
        date: futureDate,
        location: 'Virtual',
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.event.qrCode).toContain('data:image/png;base64');
  });

  it('lists events', async () => {
    const { token } = await createOrganizer();
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Dev Conference',
        description: 'Biggest tech conference',
        date: futureDate,
        location: 'Lagos',
      });

    const response = await request(app).get('/api/events');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.events)).toBe(true);
    expect(response.body.events.length).toBe(1);
  });

  it('prevents non-organizers from updating events', async () => {
    const { token: organizerToken } = await createOrganizer();
    const { token: attendeeToken } = await createAttendee();
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const createResponse = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Hackathon',
        description: '24-hour coding event',
        date: futureDate,
        location: 'Berlin',
      });

    const response = await request(app)
      .put(`/api/events/${createResponse.body.event._id}`)
      .set('Authorization', `Bearer ${attendeeToken}`)
      .send({
        title: 'Updated',
        description: 'Updated description',
        date: futureDate,
        location: 'Berlin',
      });

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
  });

  it('updates an event when organizer is authorized', async () => {
    const { token } = await createOrganizer();
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const createResponse = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Startup Demo',
        description: 'Pitch your startup',
        date: futureDate,
        location: 'Nairobi',
      });

    const response = await request(app)
      .put(`/api/events/${createResponse.body.event._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Startup Demo Day',
        description: 'Pitch your startup ideas',
        date: futureDate,
        location: 'Nairobi',
      });

    expect(response.status).toBe(200);
    expect(response.body.event.title).toBe('Startup Demo Day');
  });

  it('deletes an event when organizer is authorized', async () => {
    const { token } = await createOrganizer();
    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const createResponse = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Delete Me',
        description: 'Remove this event',
        date: futureDate,
        location: 'Accra',
      });

    const response = await request(app)
      .delete(`/api/events/${createResponse.body.event._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event deleted successfully');
  });
});
