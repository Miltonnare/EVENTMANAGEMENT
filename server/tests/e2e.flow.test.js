jest.mock('../config/cloudinary', () => ({
  upload: {
    single: () => (req, res, next) => next(),
  },
  handleUploadError: (err, req, res, next) => next(err),
}));

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(() => Promise.resolve('data:image/png;base64,QR_CODE')),
}));

const request = require('supertest');
const app = require('../app');

describe('End-to-end API flow', () => {
  it('registers users, creates an event, and registers an attendee', async () => {
    const organizer = await request(app).post('/api/auth/register').send({
      name: 'Organizer',
      email: 'e2e_organizer@example.com',
      phone: '1234567890',
      password: 'password123',
      role: 'organizer',
    });

    const attendee = await request(app).post('/api/auth/register').send({
      name: 'Attendee',
      email: 'e2e_attendee@example.com',
      phone: '1234567890',
      password: 'password123',
      role: 'attendee',
    });

    const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    const eventResponse = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizer.body.token}`)
      .send({
        title: 'E2E Event',
        description: 'Event created in end-to-end test',
        date: futureDate,
        location: 'Remote',
      });

    expect(eventResponse.status).toBe(201);

    const registerResponse = await request(app)
      .post(`/api/eventRegistration/${eventResponse.body.event._id}/register`)
      .set('Authorization', `Bearer ${attendee.body.token}`)
      .send();

    expect(registerResponse.status).toBe(200);

    const attendeesResponse = await request(app)
      .get(`/api/eventRegistration/${eventResponse.body.event._id}/attendees`)
      .set('Authorization', `Bearer ${organizer.body.token}`);

    expect(attendeesResponse.status).toBe(200);
    expect(attendeesResponse.body.attendees).toHaveLength(1);
  });
});
