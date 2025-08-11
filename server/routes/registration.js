const express=require('express');
const router=express.Router();

const protect=require('../middlewares/authMiddleware');
const {
    registerForEvent,cancelRegistration,viewAttendees
}=require('../controllers/registrationController');

router.post('/:eventId/register',protect,registerForEvent);

router.delete('/:eventId/cancel',protect,cancelRegistration);
router.get('/:eventId/attendees',protect,viewAttendees);

module.exports=router;