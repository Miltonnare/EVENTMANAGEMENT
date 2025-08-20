
const express=require('express');

const router=express.Router();

const {createEvent,updateEvent,deleteEvent,getEvents,getEventsById,getMyEvents,getRegisteredEvents,getEventAttendees}=require('../controllers/eventController')
const protect=require('../middlewares/authMiddleware');
const {upload}=require('../middlewares/uploadMiddleware');



router.get('/',getEvents);

router.get('/mine/me', protect, getMyEvents);
router.get('/registered/me', protect, getRegisteredEvents);
router.get('/:eventId/attendees', protect, getEventAttendees);

router.get('/:id',getEventsById);

router.post('/',protect,upload.single("image"),createEvent);
router.put('/:id',protect,updateEvent);
router.delete('/:id', protect,deleteEvent);

module.exports=router;
