const express = require('express');
const router = express.Router();

const { register, login, getProfile } = require('../controllers/authController');
const protect = require('../middlewares/authMiddleware');

// Register route
router.post('/register', register);

router.post('/login',login);


// Protected profile route
router.get('/profile', protect, getProfile);



module.exports = router;
