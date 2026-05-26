const Events = require('../models/Events');
const ApiError = require('../utils/ApiError');

const registerForEvent = async (eventId, userId) => {
  const event = await Events.findById(eventId);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.attendees.some((att) => att.toString() === userId.toString())) {
    throw new ApiError(400, 'Already registered for this Event');
  }

  if (event.capacity && event.attendees.length >= Number(event.capacity)) {
    throw new ApiError(400, 'Event is Full');
  }

  event.attendees.push(userId);
  await event.save();
};

const cancelRegistration = async (eventId, userId) => {
  const event = await Events.findById(eventId);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  event.attendees = event.attendees.filter(
    (attendee) => attendee.toString() !== userId.toString()
  );
  await event.save();
};

const viewAttendees = async (eventId, userId) => {
  const event = await Events.findById(eventId).populate('attendees', 'name email');

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.organizer.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to view attendees');
  }

  return event.attendees;
};

module.exports = { registerForEvent, cancelRegistration, viewAttendees };
