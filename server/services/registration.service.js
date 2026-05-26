const ticketService = require('./ticket.service');

const registerForEvent = async (eventId, userId, body = {}) => {
  const result = await ticketService.purchaseWithLegacyRegister(eventId, userId, body);
  return result;
};

const cancelRegistration = async (eventId, userId) => {
  await ticketService.cancelUserTicketsForEvent(eventId, userId);
};

const viewAttendees = async (eventId, userId) =>
  ticketService.getEventAttendeesFromTickets(eventId, userId);

module.exports = { registerForEvent, cancelRegistration, viewAttendees };
