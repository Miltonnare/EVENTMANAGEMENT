const express = require('express');
const {
  purchaseTickets,
  getMyTickets,
  getPurchaseHistory,
  getTicket,
  downloadTicket,
} = require('../controllers/ticketController');
const protect = require('../middleware/auth.middleware');
const { handleValidationErrors } = require('../middleware/validate.middleware');
const { purchaseValidator, ticketIdParam } = require('../validators/ticket.validator');

const router = express.Router();

router.post('/purchase', protect, purchaseValidator, handleValidationErrors, purchaseTickets);
router.get('/my', protect, getMyTickets);
router.get('/history', protect, getPurchaseHistory);
router.get('/:ticketId/download', protect, ticketIdParam, handleValidationErrors, downloadTicket);
router.get('/:ticketId', protect, ticketIdParam, handleValidationErrors, getTicket);

module.exports = router;
