jest.mock('../config/cloudinary', () => ({
  upload: { single: () => (req, res, next) => next() },
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

const createEvent = async (token) => {
  const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const response = await request(app)
    .post('/api/events')
    .set('Authorization', `Bearer ${token}`)
    .send({
      title: 'Ticketed Event',
      description: 'Event with ticket tiers',
      date: futureDate,
      location: 'Arena',
    });
  return response.body.event;
};

describe('Ticketing API', () => {
  it('lists ticket types with availability status', async () => {
    const organizer = await createUser('organizer', `tix_${Date.now()}`);
    const event = await createEvent(organizer.token);

    const response = await request(app).get(`/api/events/${event._id}/ticket-types`);

    expect(response.status).toBe(200);
    expect(response.body.ticketTypes.length).toBeGreaterThan(0);
    expect(response.body.ticketTypes[0]).toHaveProperty('status');
    expect(response.body.ticketTypes[0]).toHaveProperty('currentPrice');
  });

  it('purchases tickets and supports download', async () => {
    const organizer = await createUser('organizer', `tix2_${Date.now()}`);
    const attendee = await createUser('attendee', `tix2a_${Date.now()}`);
    const event = await createEvent(organizer.token);

    const types = await request(app).get(`/api/events/${event._id}/ticket-types`);
    const freeType = types.body.ticketTypes.find((t) => t.category === 'free');

    const purchase = await request(app)
      .post('/api/tickets/purchase')
      .set('Authorization', `Bearer ${attendee.token}`)
      .send({ eventId: event._id, ticketTypeId: freeType._id, quantity: 1 });

    expect(purchase.status).toBe(201);
    expect(purchase.body.tickets[0].ticketCode).toMatch(/^TKT-/);

    const ticketId = purchase.body.tickets[0]._id;
    const download = await request(app)
      .get(`/api/tickets/${ticketId}/download`)
      .set('Authorization', `Bearer ${attendee.token}`);

    expect(download.status).toBe(200);
    expect(download.body.ticketCode).toBe(purchase.body.tickets[0].ticketCode);
  });

  it('organizer can create paid and VIP ticket tiers', async () => {
    const organizer = await createUser('organizer', `tix3_${Date.now()}`);
    const event = await createEvent(organizer.token);

    await request(app)
      .post(`/api/events/${event._id}/ticket-types`)
      .set('Authorization', `Bearer ${organizer.token}`)
      .send({
        name: 'VIP Pass',
        category: 'vip',
        price: 99.99,
        quantity: 50,
      });

    const response = await request(app).get(`/api/events/${event._id}/ticket-types`);
    const vip = response.body.ticketTypes.find((t) => t.category === 'vip');
    expect(vip).toBeTruthy();
    expect(vip.currentPrice).toBe(99.99);
  });
});
