const express = require('express');
const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventsById,
  getMyEvents,
  getRegisteredEvents,
  getEventAttendees,
} = require('../controllers/eventController');
const {
  listTicketTypes,
  createTicketType,
  updateTicketType,
  deleteTicketType,
} = require('../controllers/ticketController');
const protect = require('../middleware/auth.middleware');
const { upload, handleUploadError } = require('../config/cloudinary');
const { validateEventInput } = require('../validators/event.validator');
const { validateUploadedImage } = require('../middleware/upload.middleware');
const { handleValidationErrors } = require('../middleware/validate.middleware');
const {
  eventIdParam,
  typeIdParam,
  createTicketTypeValidator,
} = require('../validators/ticket.validator');

const router = express.Router();

router.get('/', getEvents);
router.get('/mine/me', protect, getMyEvents);
router.get('/registered/me', protect, getRegisteredEvents);
router.get('/:eventId/attendees', protect, getEventAttendees);
router.get(
  '/:eventId/ticket-types',
  eventIdParam,
  handleValidationErrors,
  listTicketTypes
);
router.post(
  '/:eventId/ticket-types',
  protect,
  eventIdParam,
  createTicketTypeValidator,
  handleValidationErrors,
  createTicketType
);
router.put(
  '/:eventId/ticket-types/:typeId',
  protect,
  eventIdParam,
  typeIdParam,
  handleValidationErrors,
  updateTicketType
);
router.delete(
  '/:eventId/ticket-types/:typeId',
  protect,
  eventIdParam,
  typeIdParam,
  handleValidationErrors,
  deleteTicketType
);
router.get('/:id', getEventsById);

router.post(
  '/',
  protect,
  validateEventInput,
  upload.single('image'),
  handleUploadError,
  validateUploadedImage,
  createEvent
);

router.put(
  '/:id',
  protect,
  validateEventInput,
  upload.single('image'),
  handleUploadError,
  validateUploadedImage,
  updateEvent
);

router.delete('/:id', protect, deleteEvent);

module.exports = router;
