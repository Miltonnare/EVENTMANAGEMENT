const asyncHandler = require('../middleware/asyncHandler');
const registrationService = require('../services/registration.service');
const ApiError = require('../utils/ApiError');
const { sendMessageResponse } = require('../utils/responseHelpers');

const handleRegistrationError = (res, error) => {
  if (error instanceof ApiError) {
    return sendMessageResponse(res, error.statusCode, error.message);
  }
  return res.status(500).json({ message: 'Server error', Error: error.message });
};

const registerForEvent = asyncHandler(async (req, res) => {
  try {
    await registrationService.registerForEvent(req.params.eventId, req.user._id);
    return sendMessageResponse(
      res,
      200,
      'Succesfully registered for the event '
    );
  } catch (error) {
    return handleRegistrationError(res, error);
  }
});

const cancelRegistration = asyncHandler(async (req, res) => {
  try {
    await registrationService.cancelRegistration(req.params.eventId, req.user._id);
    return sendMessageResponse(res, 200, 'Registration cancelled');
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', Error: error.message });
  }
});

const viewAttendees = asyncHandler(async (req, res) => {
  try {
    const attendees = await registrationService.viewAttendees(
      req.params.eventId,
      req.user._id
    );
    return res.status(200).json({ attendees });
  } catch (error) {
    if (error instanceof ApiError) {
      return sendMessageResponse(res, error.statusCode, error.message);
    }
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = { registerForEvent, cancelRegistration, viewAttendees };
