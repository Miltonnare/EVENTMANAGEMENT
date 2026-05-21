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

const createUser = async (role, suffix) => {
  const payload = {
    name: `${role} User`,
    email: `${role}_${suffix}@example.com`,
    phone: '1234567890',
    password: 'password123',
    role,
  };
  const response = await request(app).post('/api/auth/register').send(payload);
  return { token: response.body.token, user: response.body.user };
};

const createEvent = async (token, overrides = {}) => {
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const response = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Community Meetup',
      description: 'Open community meetup',
      date: futureDate,
      location: 'Online',
      ...overrides,
    });

  return response.body.event;
};

describe('Event registration routes', () => {
  it('registers and cancels an attendee for an event', async () => {
    const organizer = await createUser('organizer', Date.now());
    const attendee = await createUser('attendee', `${Date.now()}_1`);
    const event = await createEvent(organizer.token);

    const registerResponse = await request(app)
      .post(`/api/eventRegistration/${event._id}/register`)
      .set('Authorization', `Bearer ${attendee.token}`)
      .send();

    expect(registerResponse.status).toBe(200);
    expect(registerResponse.body.message).toMatch(/Succesfully registered/i);

    const cancelResponse = await request(app)
      .delete(`/api/eventRegistration/${event._id}/cancel`)
      .set('Authorization', `Bearer ${attendee.token}`)
      .send();

    expect(cancelResponse.status).toBe(200);
    expect(cancelResponse.body.message).toBe('Registration cancelled');
  });

  it('prevents duplicate registrations and respects capacity limits', async () => {
    const organizer = await createUser('organizer', `${Date.now()}_2`);
    const attendeeOne = await createUser('attendee', `${Date.now()}_3`);
    const attendeeTwo = await createUser('attendee', `${Date.now()}_4`);

    const event = await createEvent(organizer.token, { capacity: 1 });

    await request(app)
      .post(`/api/eventRegistration/${event._id}/register`)
      .set('Authorization', `Bearer ${attendeeOne.token}`)
      .send();

    const duplicateResponse = await request(app)
      .post(`/api/eventRegistration/${event._id}/register`)
      .set('Authorization', `Bearer ${attendeeOne.token}`)
      .send();

    expect(duplicateResponse.status).toBe(400);
    expect(duplicateResponse.body.message).toBe('Already registered for this Event');

    const capacityResponse = await request(app)
      .post(`/api/eventRegistration/${event._id}/register`)
      .set('Authorization', `Bearer ${attendeeTwo.token}`)
      .send();

    expect(capacityResponse.status).toBe(400);
    expect(capacityResponse.body.message).toBe('Event is Full');
  });

  it('allows organizers to view attendees', async () => {
    const organizer = await createUser('organizer', `${Date.now()}_5`);
    const attendee = await createUser('attendee', `${Date.now()}_6`);
    const event = await createEvent(organizer.token);

    await request(app)
      .post(`/api/eventRegistration/${event._id}/register`)
      .set('Authorization', `Bearer ${attendee.token}`)
      .send();

    const response = await request(app)
      .get(`/api/eventRegistration/${event._id}/attendees`)
      .set('Authorization', `Bearer ${organizer.token}`);

    expect(response.status).toBe(200);
    expect(response.body.attendees.length).toBe(1);
    expect(response.body.attendees[0].email).toBe(attendee.user.email);
  });
});
