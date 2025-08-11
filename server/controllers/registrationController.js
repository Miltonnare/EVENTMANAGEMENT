const Event=require('../models/Events');
const User=require('../models/User');

const registerForEvent=async(req,res)=>{
    try {
        const event=await Event.findById(req.params.eventId);

        if(!event){
            return res.status(404).json({message:'Event not found'});
        }
        if(event.attendees.some(att => att.toString() === req.user._id.toString())){
                return res.status(400).json({message:'Already registered for this Event'});
            }

            if(event.capacity && event.attendees.length >= Number(event.capacity)){
               return res.status(400).json({message:'Event is Full'})
            }

            event.attendees.push(req.user._id);
            await event.save();

            res.status(200).json({message:'Succesfully registered for the event '});
        
    } catch (error) {
        return res.status(500).json({message:'Server error',Error:error.message});
        
    }
};

const cancelRegistration=async (req,res)=>{
    try {
        const event=await Event.findById(req.params.eventId);

        if(!event) return res.status(404).json({message:'Event not found'});

        event.attendees=event.attendees.filter(attendee => attendee.toString() !== req.user._id.toString());

        await event.save();

        res.status(200).json({message:'Registration cancelled'});
        
    } catch (error) {
        res.status(500).json({message:'Server Error',Error:error.message});
        
    }
};

const viewAttendees=async (req,res)=>{
    try {
        const event=await Event.findById(req.params.eventId).populate('attendees','name email');
        
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view attendees' });
    }

    res.status(200).json({ attendees: event.attendees });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports={registerForEvent,cancelRegistration,viewAttendees};