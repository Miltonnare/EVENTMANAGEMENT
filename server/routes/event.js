
const express=require('express');

const router=express.Router();

const {createEvent,updateEvent,deleteEvent,getEvents,getEventsById}=require('../controllers/eventController')

const {protect}=require('../middlewares/authMiddleware');

router.get('/',getEvents);

router.get('/:id',getEventsById);

router.post('/',protect,createEvent);
router.put('/',protect,updateEvent);
router.delete('/', protect,deleteEvent);

module.exports=router;