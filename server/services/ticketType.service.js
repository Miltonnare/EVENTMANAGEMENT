const Events = require('../models/Events');
const TicketType = require('../models/TicketType');
const ApiError = require('../utils/ApiError');
const { formatTicketTypeForClient } = require('../utils/ticketPricing');

const assertOrganizer = async (eventId, userId) => {
  const event = await Events.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.organizer.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to manage tickets for this event');
  }
  return event;
};

const createDefaultFreeTicket = async (eventId, capacity) => {
  const existing = await TicketType.findOne({ event: eventId, category: 'free' });
  if (existing) return existing;

  return TicketType.create({
    event: eventId,
    name: 'General Admission',
    category: 'free',
    description: 'Free entry ticket',
    price: 0,
    quantity: capacity || null,
  });
};

const listTicketTypes = async (eventId, { includeInactive = false } = {}) => {
  const event = await Events.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  const query = { event: eventId };
  if (!includeInactive) query.isActive = true;

  const types = await TicketType.find(query).sort({ price: 1, createdAt: 1 });
  return types.map(formatTicketTypeForClient);
};

const createTicketType = async (eventId, userId, payload) => {
  await assertOrganizer(eventId, userId);

  const ticketType = await TicketType.create({
    event: eventId,
    name: payload.name,
    category: payload.category,
    description: payload.description,
    price: payload.price ?? 0,
    quantity: payload.quantity ?? null,
    salesCloseDate: payload.salesCloseDate,
    dynamicPricing: payload.dynamicPricing,
    isActive: payload.isActive !== false,
  });

  return formatTicketTypeForClient(ticketType);
};

const updateTicketType = async (eventId, typeId, userId, payload) => {
  await assertOrganizer(eventId, userId);

  const ticketType = await TicketType.findOne({ _id: typeId, event: eventId });
  if (!ticketType) throw new ApiError(404, 'Ticket type not found');

  if (payload.name != null) ticketType.name = payload.name;
  if (payload.description != null) ticketType.description = payload.description;
  if (payload.price != null) ticketType.price = payload.price;
  if (payload.quantity != null) ticketType.quantity = payload.quantity;
  if (payload.salesCloseDate != null) ticketType.salesCloseDate = payload.salesCloseDate;
  if (payload.dynamicPricing != null) ticketType.dynamicPricing = payload.dynamicPricing;
  if (payload.isActive != null) ticketType.isActive = payload.isActive;

  if (ticketType.quantity != null && ticketType.soldCount > ticketType.quantity) {
    throw new ApiError(400, 'Quantity cannot be less than tickets already sold');
  }

  await ticketType.save();
  return formatTicketTypeForClient(ticketType);
};

const deleteTicketType = async (eventId, typeId, userId) => {
  await assertOrganizer(eventId, userId);

  const ticketType = await TicketType.findOne({ _id: typeId, event: eventId });
  if (!ticketType) throw new ApiError(404, 'Ticket type not found');

  if (ticketType.soldCount > 0) {
    throw new ApiError(400, 'Cannot delete ticket type with existing sales');
  }

  await ticketType.deleteOne();
  return { message: 'Ticket type deleted' };
};

module.exports = {
  createDefaultFreeTicket,
  listTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
};
