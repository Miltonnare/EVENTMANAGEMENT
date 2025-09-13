
const express = require('express');
const router = express.Router();

const {
  createEvent,
  updateEvent,
  deleteEvent,
  getEvents,
  getEventsById,
  getMyEvents,
  getRegisteredEvents,
  getEventAttendees
} = require('../controllers/eventController');

const protect = require('../middlewares/authMiddleware');
const { upload, handleUploadError } = require('../config/cloudinary');
const { validateEventInput } = require('../config/security');



router.get('/',getEvents);

router.get('/mine/me', protect, getMyEvents);
router.get('/registered/me', protect, getRegisteredEvents);
router.get('/:eventId/attendees', protect, getEventAttendees);

router.get('/:id',getEventsById);

router.post('/', protect, validateEventInput, upload.single("image"), handleUploadError, createEvent);
router.put('/:id', protect, validateEventInput, upload.single("image"), handleUploadError, updateEvent);
router.delete('/:id', protect,deleteEvent);

module.exports=router;
