const QrCode = require('qrcode');
const Events = require('../models/Events');
const Ticket = require('../models/Ticket');
const TicketType = require('../models/TicketType');
const TicketPurchase = require('../models/TicketPurchase');
const ApiError = require('../utils/ApiError');
const { generateTicketCode } = require('../utils/ticketCode');
const {
  getTicketTypeStatus,
  getCurrentPrice,
  getAvailableQuantity,
  formatTicketTypeForClient,
} = require('../utils/ticketPricing');
const ticketTypeService = require('./ticketType.service');

const syncEventAttendee = async (eventId, userId) => {
  const event = await Events.findById(eventId);
  if (!event) return;

  const hasTicket = await Ticket.exists({
    event: eventId,
    owner: userId,
    status: 'valid',
  });

  const userIdStr = userId.toString();
  const alreadyListed = event.attendees.some((a) => a.toString() === userIdStr);

  if (hasTicket && !alreadyListed) {
    event.attendees.push(userId);
    await event.save({ validateBeforeSave: false });
  } else if (!hasTicket && alreadyListed) {
    event.attendees = event.attendees.filter((a) => a.toString() !== userIdStr);
    await event.save({ validateBeforeSave: false });
  }
};

const reserveTicketInventory = async (ticketTypeId, qty) => {
  const ticketType = await TicketType.findById(ticketTypeId);
  if (!ticketType) throw new ApiError(404, 'Ticket type not found');

  const status = getTicketTypeStatus(ticketType);
  if (status === 'expired') throw new ApiError(400, 'Ticket sales have closed for this tier');
  if (status === 'sold_out') throw new ApiError(400, 'This ticket tier is sold out');

  const available = getAvailableQuantity(ticketType);
  if (available != null && qty > available) {
    throw new ApiError(400, `Only ${available} ticket(s) remaining`);
  }

  if (ticketType.quantity != null) {
    const updated = await TicketType.findOneAndUpdate(
      {
        _id: ticketTypeId,
        $expr: { $lt: ['$soldCount', '$quantity'] },
      },
      { $inc: { soldCount: qty } },
      { new: true }
    );

    if (!updated) {
      throw new ApiError(400, 'This ticket tier is sold out');
    }

    return updated;
  }

  ticketType.soldCount += qty;
  await ticketType.save();
  return ticketType;
};

const purchaseTickets = async (eventId, userId, { ticketTypeId, quantity = 1 }) => {
  const qty = Number(quantity);
  if (!ticketTypeId || !qty || qty < 1 || qty > 10) {
    throw new ApiError(400, 'Valid ticket type and quantity (1-10) are required');
  }

  const event = await Events.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');

  const existingForEvent = await Ticket.findOne({
    event: eventId,
    owner: userId,
    status: 'valid',
  });

  if (existingForEvent) {
    throw new ApiError(400, 'Already registered for this Event');
  }

  const ticketType = await reserveTicketInventory(ticketTypeId, qty);
  const unitPrice = getCurrentPrice(ticketType);
  const totalAmount = unitPrice * qty;

  try {
    const purchase = await TicketPurchase.create({
      user: userId,
      event: eventId,
      ticketType: ticketTypeId,
      quantity: qty,
      unitPrice,
      totalAmount,
      status: 'completed',
    });

    const issuedTickets = [];

    for (let i = 0; i < qty; i += 1) {
      const ticketCode = generateTicketCode();
      const qrPayload = JSON.stringify({
        ticketCode,
        eventId,
        ticketTypeId,
        ownerId: userId,
      });
      const qrCode = await QrCode.toDataURL(qrPayload);

      const ticket = await Ticket.create({
        ticketCode,
        event: eventId,
        ticketType: ticketTypeId,
        owner: userId,
        purchase: purchase._id,
        pricePaid: unitPrice,
        status: 'valid',
        qrCode,
      });

      issuedTickets.push(ticket);
    }

    purchase.tickets = issuedTickets.map((t) => t._id);
    await purchase.save();

    await syncEventAttendee(eventId, userId, true);

    return {
      purchase,
      tickets: issuedTickets,
      ticketType: formatTicketTypeForClient(ticketType),
    };
  } catch (error) {
    await TicketType.findByIdAndUpdate(ticketTypeId, { $inc: { soldCount: -qty } });
    throw error;
  }
};

const purchaseWithLegacyRegister = async (eventId, userId, body = {}) => {
  const existingForEvent = await Ticket.findOne({
    event: eventId,
    owner: userId,
    status: 'valid',
  });

  if (existingForEvent) {
    throw new ApiError(400, 'Already registered for this Event');
  }

  if (body.ticketTypeId) {
    return purchaseTickets(eventId, userId, body);
  }

  let types = await TicketType.find({ event: eventId, isActive: true }).sort({
    price: 1,
  });

  if (!types.length) {
    const event = await Events.findById(eventId);
    await ticketTypeService.createDefaultFreeTicket(eventId, event?.capacity);
    types = await TicketType.find({ event: eventId, isActive: true }).sort({ price: 1 });
  }

  const activeType =
    types.find((t) => getTicketTypeStatus(t) === 'active' && t.category === 'free') ||
    types.find((t) => getTicketTypeStatus(t) === 'active');

  if (!activeType) {
    throw new ApiError(400, 'Event is Full');
  }

  return purchaseTickets(eventId, userId, {
    ticketTypeId: activeType._id,
    quantity: 1,
  });
};

const cancelUserTicketsForEvent = async (eventId, userId) => {
  const tickets = await Ticket.find({
    event: eventId,
    owner: userId,
    status: 'valid',
  });

  if (!tickets.length) {
    throw new ApiError(400, 'No active tickets found for this event');
  }

  const byType = {};
  for (const ticket of tickets) {
    ticket.status = 'cancelled';
    await ticket.save();
    const key = ticket.ticketType.toString();
    byType[key] = (byType[key] || 0) + 1;
  }

  for (const [typeId, count] of Object.entries(byType)) {
    await TicketType.findByIdAndUpdate(typeId, { $inc: { soldCount: -count } });
  }

  await TicketPurchase.updateMany(
    { event: eventId, user: userId, status: 'completed' },
    { status: 'cancelled' }
  );

  await syncEventAttendee(eventId, userId, false);
};

const getUserTickets = async (userId) => {
  const tickets = await Ticket.find({ owner: userId })
    .populate('event', 'title date location')
    .populate('ticketType', 'name category price')
    .sort({ createdAt: -1 });

  return tickets;
};

const getPurchaseHistory = async (userId) => {
  const purchases = await TicketPurchase.find({ user: userId })
    .populate('event', 'title date location')
    .populate('ticketType', 'name category')
    .populate('tickets')
    .sort({ purchasedAt: -1 });

  return purchases;
};

const getTicketById = async (ticketId, userId) => {
  const ticket = await Ticket.findById(ticketId)
    .populate('event')
    .populate('ticketType')
    .populate('owner', 'name email');

  if (!ticket) throw new ApiError(404, 'Ticket not found');

  const event = ticket.event;
  const isOwner = ticket.owner._id.toString() === userId.toString();
  const isOrganizer = event.organizer?.toString() === userId.toString();

  if (!isOwner && !isOrganizer) {
    throw new ApiError(403, 'Not authorized to view this ticket');
  }

  return ticket;
};

const getEventAttendeesFromTickets = async (eventId, userId) => {
  const event = await Events.findById(eventId);
  if (!event) throw new ApiError(404, 'Event not found');
  if (event.organizer.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to view attendees');
  }

  const tickets = await Ticket.find({ event: eventId, status: 'valid' }).populate(
    'owner',
    'name email'
  );

  const unique = new Map();
  tickets.forEach((t) => {
    if (t.owner) unique.set(t.owner._id.toString(), t.owner);
  });

  return Array.from(unique.values());
};

const getRegisteredEventsForUser = async (userId) => {
  const eventIds = await Ticket.distinct('event', {
    owner: userId,
    status: 'valid',
  });

  return Events.find({ _id: { $in: eventIds } });
};

const buildTicketDownload = (ticket) => ({
  ticketCode: ticket.ticketCode,
  status: ticket.status,
  pricePaid: ticket.pricePaid,
  event: {
    title: ticket.event?.title,
    date: ticket.event?.date,
    location: ticket.event?.location,
  },
  ticketType: {
    name: ticket.ticketType?.name,
    category: ticket.ticketType?.category,
  },
  owner: {
    name: ticket.owner?.name,
    email: ticket.owner?.email,
  },
  qrCode: ticket.qrCode,
  issuedAt: ticket.createdAt,
});

module.exports = {
  purchaseTickets,
  purchaseWithLegacyRegister,
  cancelUserTicketsForEvent,
  getUserTickets,
  getPurchaseHistory,
  getTicketById,
  getEventAttendeesFromTickets,
  getRegisteredEventsForUser,
  buildTicketDownload,
  syncEventAttendee,
};
