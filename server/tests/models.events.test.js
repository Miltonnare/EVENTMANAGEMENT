const Events = require('../models/Events');
const User = require('../models/User');

describe('Events model', () => {
  const futureDate = () => new Date(Date.now() + 24 * 60 * 60 * 1000);

  it('calculates virtuals for capacity and availability', async () => {
    const organizer = await User.create({
      name: 'Organizer',
      email: 'organizer_model@example.com',
      phone: '1234567890',
      password: 'password123',
      role: 'organizer',
    });

    const event = new Events({
      title: 'Virtuals Test',
      description: 'Testing virtuals',
      date: futureDate(),
      location: 'Online',
      capacity: 2,
      organizer: organizer._id,
      attendees: [organizer._id],
    });

    expect(event.attendeeCount).toBe(1);
    expect(event.isFull).toBe(false);
    expect(event.isAvailable).toBe(true);
  });

  it('blocks saving when attendees exceed capacity', async () => {
    const organizer = await User.create({
      name: 'Organizer 2',
      email: 'organizer_model2@example.com',
      phone: '1234567890',
      password: 'password123',
      role: 'organizer',
    });

    const event = new Events({
      title: 'Capacity Check',
      description: 'Event capacity validation',
      date: futureDate(),
      location: 'Kigali',
      capacity: 1,
      organizer: organizer._id,
      attendees: [organizer._id, new User()._id],
    });

    await expect(event.save()).rejects.toThrow('Number of attendees cannot exceed event capacity');
  });
});
