const asyncHandler = require('../middleware/asyncHandler');
const eventService = require('../services/event.service');
const ApiError = require('../utils/ApiError');
const {
  sendSuccess,
  sendError,
  sendData,
  sendMessageResponse,
} = require('../utils/responseHelpers');

const handleEventError = (res, error) => {
  if (error instanceof ApiError) {
    return sendError(res, error.statusCode, error.message);
  }

  if (error.name === 'ValidationError') {
    const details = Object.values(error.errors).map((err) => err.message);
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details,
    });
  }

  console.error('Event controller error:', error);
  return res.status(500).json({
    success: false,
    error: 'Internal server error. Please try again later.',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
  });
};

const createEvent = asyncHandler(async (req, res) => {
  try {
    const event = await eventService.createEvent(req.body, req.file, req.user._id);
    return sendSuccess(res, 201, {
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    return handleEventError(res, error);
  }
});

const getEvents = asyncHandler(async (req, res) => {
  try {
    const events = await eventService.getEvents();
    return sendSuccess(res, 200, { events });
  } catch (error) {
    return res.status(500).json({ success: false, Error: error.message });
  }
});

const getEventsById = asyncHandler(async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    return sendSuccess(res, 200, { event });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendError(res, error.statusCode, error.message);
    }
    return res.status(500).json({ success: false, Error: error.message });
  }
});

const getMyEvents = asyncHandler(async (req, res) => {
  try {
    const events = await eventService.getMyEvents(req.user._id);
    return sendData(res, 200, events);
  } catch (error) {
    return sendMessageResponse(res, 500, 'Server error', { error: error.message });
  }
});

const getRegisteredEvents = asyncHandler(async (req, res) => {
  try {
    const events = await eventService.getRegisteredEvents(req.user._id);
    return sendData(res, 200, events);
  } catch (error) {
    return sendMessageResponse(res, 500, 'Server error', { error: error.message });
  }
});

const getEventAttendees = asyncHandler(async (req, res) => {
  try {
    const attendees = await eventService.getEventAttendees(
      req.params.eventId,
      req.user._id
    );
    return sendData(res, 200, { attendees });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendMessageResponse(res, error.statusCode, error.message);
    }
    return sendMessageResponse(res, 500, 'Server error', { error: error.message });
  }
});

const updateEvent = asyncHandler(async (req, res) => {
  try {
    const event = await eventService.updateEvent(
      req.params.id,
      req.body,
      req.file,
      req.user._id
    );
    return sendSuccess(res, 200, {
      message: 'Event updated successfully',
      event,
    });
  } catch (error) {
    return handleEventError(res, error);
  }
});

const deleteEvent = asyncHandler(async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id, req.user._id);
    return sendSuccess(res, 200, { message: 'Event deleted successfully' });
  } catch (error) {
    return handleEventError(res, error);
  }
});

module.exports = {
  createEvent,
  getEvents,
  getEventsById,
  getMyEvents,
  getRegisteredEvents,
  getEventAttendees,
  updateEvent,
  deleteEvent,
};
