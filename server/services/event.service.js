const Events = require('../models/Events');
const QrCode = require('qrcode');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const { buildImagePayload, deleteEventImage } = require('../utils/cloudinaryUtils');
const ticketTypeService = require('./ticketType.service');
const ticketService = require('./ticket.service');
const { formatTicketTypeForClient } = require('../utils/ticketPricing');

const applyImageToEventData = (eventData, file) => {
  const imagePayload = buildImagePayload(file);
  if (!imagePayload) return;
  Object.assign(eventData, imagePayload);
};

const createEvent = async (body, file, organizerId) => {
  const { title, description, date, location, capacity } = body || {};

  if (!title || !description || !date || !location) {
    throw new ApiError(
      400,
      'Missing required fields: title, description, date, and location are required'
    );
  }

  const eventDate = new Date(date);
  if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
    throw new ApiError(400, 'Invalid date. Date must be a valid future date');
  }

  if (capacity !== undefined && capacity !== null && capacity !== '') {
    const numCapacity = Number(capacity);
    if (isNaN(numCapacity) || numCapacity < 1) {
      throw new ApiError(400, 'Capacity must be a positive number when provided');
    }
  }

  const eventData = {
    title: title.trim(),
    description: description.trim(),
    date: eventDate,
    location: location.trim(),
    organizer: organizerId,
  };

  applyImageToEventData(eventData, file);

  if (
    capacity !== undefined &&
    capacity !== null &&
    capacity !== '' &&
    !isNaN(Number(capacity))
  ) {
    eventData.capacity = Number(capacity);
  }

  const newEvent = new Events(eventData);
  await newEvent.save();

  const eventUrl = `${config.clientUrl}/events/${newEvent._id}`;
  newEvent.qrCode = await QrCode.toDataURL(eventUrl);
  await newEvent.save();
  await newEvent.populate('organizer', 'name email');

  await ticketTypeService.createDefaultFreeTicket(newEvent._id, newEvent.capacity);

  return newEvent;
};

const getEvents = async (queryParams = {}) => {
  const { page = 1, limit = 20, search, category, status, sortBy = 'date', sortOrder = 'asc' } = queryParams;
  const filter = {};

  if (status) {
    filter.status = status;
  }
  if (category && category !== 'all') {
    filter.tags = { $in: [category] };
  }
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  const sortObj = { [sortBy]: sortDirection };

  const [events, total] = await Promise.all([
    Events.find(filter)
      .populate('organizer', 'name email')
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean({ virtuals: true }),
    Events.countDocuments(filter),
  ]);

  return {
    events,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

const getEventById = async (id) => {
  const event = await Events.findById(id).populate('organizer', 'name email');
  if (!event) {
    throw new ApiError(404, 'Event Not Found');
  }

  const ticketTypes = await ticketTypeService.listTicketTypes(id);
  const eventObj = event.toObject({ virtuals: true });
  eventObj.ticketTypes = ticketTypes;
  return eventObj;
};

const getMyEvents = async (organizerId) =>
  Events.find({ organizer: organizerId })
    .populate('organizer', 'name email')
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });

const getRegisteredEvents = async (userId) =>
  ticketService.getRegisteredEventsForUser(userId);

const getEventAttendees = async (eventId, userId) =>
  ticketService.getEventAttendeesFromTickets(eventId, userId);

const updateEvent = async (id, body, file, userId) => {
  const { title, description, date, location, capacity } = body;
  const event = await Events.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (String(event.organizer) !== userId.toString()) {
    throw new ApiError(
      403,
      'Unauthorized. Only the event organizer can update this event.'
    );
  }

  if (date) {
    const eventDate = new Date(date);
    if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
      throw new ApiError(400, 'Invalid date. Date must be a valid future date');
    }
    event.date = eventDate;
  }

  if (capacity !== undefined && capacity !== null && capacity !== '') {
    const numCapacity = Number(capacity);
    if (isNaN(numCapacity) || numCapacity < 1) {
      throw new ApiError(400, 'Capacity must be a positive number when provided');
    }
    event.capacity = numCapacity;
  }

  if (title) event.title = title.trim();
  if (description) event.description = description.trim();
  if (location) event.location = location.trim();

  if (file) {
    await deleteEventImage(event);
    const imagePayload = buildImagePayload(file);
    event.image = imagePayload.image;
    event.imagePublicId = imagePayload.imagePublicId;
    event.imageUrls = imagePayload.imageUrls;
  }

  await event.save();
  await event.populate('organizer', 'name email');
  return event;
};

const deleteEvent = async (id, userId) => {
  const event = await Events.findById(id);

  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (String(event.organizer) !== userId.toString()) {
    throw new ApiError(
      403,
      'Unauthorized. Only the event organizer can delete this event.'
    );
  }

  await deleteEventImage(event);
  await Events.findByIdAndDelete(id);
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  getRegisteredEvents,
  getEventAttendees,
  updateEvent,
  deleteEvent,
};
