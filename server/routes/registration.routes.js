const express = require('express');
const {
  registerForEvent,
  cancelRegistration,
  viewAttendees,
} = require('../controllers/registrationController');
const protect = require('../middleware/auth.middleware');
const { eventIdParamValidator } = require('../validators/registration.validator');
const { handleValidationErrors } = require('../middleware/validate.middleware');

const router = express.Router();

router.post(
  '/:eventId/register',
  protect,
  eventIdParamValidator,
  handleValidationErrors,
  registerForEvent
);

router.delete(
  '/:eventId/cancel',
  protect,
  eventIdParamValidator,
  handleValidationErrors,
  cancelRegistration
);

router.get(
  '/:eventId/attendees',
  protect,
  eventIdParamValidator,
  handleValidationErrors,
  viewAttendees
);

module.exports = router;
