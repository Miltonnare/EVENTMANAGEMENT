const Events = require('../models/Events');
const QrCode = require('qrcode');
const config = require('../config');
const ApiError = require('../utils/ApiError');
const { deleteImage } = require('../utils/cloudinaryUtils');

const resolveImageUrl = (file) => {
  if (!file) return null;
  if (file.secure_url) return file.secure_url;
  if (file.path) return file.path;
  throw new ApiError(400, 'Image upload failed. Please try again.');
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
    image: file ? resolveImageUrl(file) : null,
  };

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

  return newEvent;
};

const getEvents = async () => Events.find().populate('organizer', 'name email');

const getEventById = async (id) => {
  const event = await Events.findById(id).populate('organizer', 'name email');
  if (!event) {
    throw new ApiError(404, 'Event Not Found');
  }
  return event;
};

const getMyEvents = async (organizerId) =>
  Events.find({ organizer: organizerId });

const getRegisteredEvents = async (userId) =>
  Events.find({ attendees: userId });

const getEventAttendees = async (eventId, userId) => {
  const event = await Events.findById(eventId).populate('attendees', 'name email');
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }
  if (event.organizer.toString() !== userId.toString()) {
    throw new ApiError(403, 'Not authorized to view attendees');
  }
  return event.attendees;
};

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
    if (event.image) {
      try {
        await deleteImage(event.image);
      } catch (deleteError) {
        console.warn('Failed to delete old image:', deleteError.message);
      }
    }
    event.image = file.secure_url || file.path;
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

  if (event.image) {
    try {
      await deleteImage(event.image);
    } catch (deleteError) {
      console.warn('Failed to delete image from Cloudinary:', deleteError.message);
    }
  }

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
