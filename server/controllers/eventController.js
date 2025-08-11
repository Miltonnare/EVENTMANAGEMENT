const Events=require('../models/Events');

const createEvent=async (req,res)=>{
    try {
       const { title, description, date, location, capacity } = req.body;
       const newEvent=new Events(
        {
            title,
            description,
            date,
            location,
            capacity,
            organizer:req.user._id,
        }
       );

       await newEvent.save();
       res.status(200).json({ success: true, event: newEvent});
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
        
    }
};

const getEvents=async (req,res)=>{
    try {
         const events = await Events.find().populate('organizer', 'name email');
         res.status(200).json({success:true,events})
        
    } catch (error) {
        res.status(500).json({success:false,Error:error.message});
        
    }
};

const getEventsById=async(req,res)=>{
    try {
        const event=await Events.findById(req.params.id).populate('organizer','name email');
        if(!event) return res.status(404).json({success:false,error:'Event Not Found'});

        res.status(200).json({success:true,event});
    } catch (error) {
        res.status(500).json({success:false,Error:error.message});
        
    }
};

const getMyEvents = async (req, res) => {
    try {
        const events = await Events.find({ organizer: req.user._id });
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getRegisteredEvents = async (req, res) => {
    try {
        const events = await Events.find({ attendees: req.user._id });
        return res.status(200).json(events);
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getEventAttendees = async (req, res) => {
    try {
        const event = await Events.findById(req.params.eventId).populate('attendees', 'name email');
        if (!event) return res.status(404).json({ message: 'Event not found' });
        if (event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to view attendees' });
        }
        return res.status(200).json({ attendees: event.attendees });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateEvent = async (req, res) => {
    try {
        const { title, description, date, location, capacity } = req.body;
        // Find the event first
        const event = await Events.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ success: false, error: 'Event Not Found' });
        }

        // Check if the user is the organizer
        if (String(event.organizer) !== req.user._id.toString()) {
            return res.status(403).json({ success: false, error: 'Unauthorized' });
        }

        // Update the event
        event.title = title;
        event.description = description;
        event.date = date;
        event.location = location;
        event.capacity = capacity;
        await event.save();

        await event.populate('organizer', 'name email');
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const deleteEvent=async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, error: 'Event not found' });

    if (String(event.organizer) !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized' });
    }

    await event.remove();
    res.status(200).json({ success: true, message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventsById,
  getMyEvents,
  getRegisteredEvents,
  getEventAttendees,
  updateEvent,
  deleteEvent,
};

