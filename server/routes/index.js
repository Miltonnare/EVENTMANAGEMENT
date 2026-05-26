const express = require('express');
const authRoutes = require('./auth.routes');
const eventRoutes = require('./event.routes');
const registrationRoutes = require('./registration.routes');
const ticketRoutes = require('./ticket.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/events', eventRoutes);
router.use('/eventRegistration', registrationRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
