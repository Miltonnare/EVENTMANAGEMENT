const Events=require('../models/Events');
const QrCode=require('qrcode');

const createEvent = async (req, res) => {
    try {
        // Input validation
       const { title, description, date, location, capacity } = req.body||{};

        // Validate required fields (capacity is NOT required)
        if (!title || !description || !date || !location) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: title, description, date, and location are required'
            });
        }

        // Validate date
        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
            return res.status(400).json({
                success: false,
                error: 'Invalid date. Date must be a valid future date'
            });
        }

        // Validate capacity only if provided (completely optional)
        if (capacity !== undefined && capacity !== null && capacity !== '') {
            const numCapacity = Number(capacity);
            if (isNaN(numCapacity) || numCapacity < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Capacity must be a positive number when provided'
                });
            }
        }

        // Handle image upload
        let imageUrl = null;
        if (req.file) {
            // For Cloudinary, the secure_url contains the full URL
            imageUrl = req.file.secure_url;
        }

        // Prepare event data - only include capacity if it's a valid number
        const eventData = {
            title: title.trim(),
            description: description.trim(),
            date: eventDate,
            location: location.trim(),
            organizer: req.user._id,
            image: imageUrl,
        };

        // Only add capacity if it's provided and valid
        if (capacity !== undefined && capacity !== null && capacity !== '' && !isNaN(Number(capacity))) {
            eventData.capacity = Number(capacity);
        }

        // Create new event
        const newEvent = new Events(eventData);

       await newEvent.save();
       
       
       const eventUrl = `${process.env.CLIENT_URL}/events/${newEvent._id}`;
       const qrCodeDataUrl = await QrCode.toDataURL(eventUrl);
       
      
       newEvent.qrCode = qrCodeDataUrl;
       await newEvent.save();

    
        await newEvent.populate('organizer', 'name email');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            event: newEvent
        });

    } catch (error) {
        console.error('Create event error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: errors
            });
        }

        res.status(500).json({
            success: false,
            error: 'Internal server error. Please try again later.',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
            return res.status(404).json({ 
                success: false, 
                error: 'Event not found' 
            });
        }

        // Check if the user is the organizer
        if (String(event.organizer) !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                error: 'Unauthorized. Only the event organizer can update this event.' 
            });
        }

        // Validate date if provided
        if (date) {
            const eventDate = new Date(date);
            if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
                return res.status(400).json({
                    success: false,
                    error: 'Invalid date. Date must be a valid future date'
                });
            }
            event.date = eventDate;
        }

        // Validate capacity only if provided (completely optional)
        if (capacity !== undefined && capacity !== null && capacity !== '') {
            const numCapacity = Number(capacity);
            if (isNaN(numCapacity) || numCapacity < 1) {
                return res.status(400).json({
                    success: false,
                    error: 'Capacity must be a positive number when provided'
                });
            }
            event.capacity = numCapacity;
        }

        // Update fields if provided
        if (title) event.title = title.trim();
        if (description) event.description = description.trim();
        if (location) event.location = location.trim();

        // Handle image update if new image is uploaded
        if (req.file) {
            // Delete old image from Cloudinary if it exists
            if (event.image) {
                try {
                    const cloudinary = require('cloudinary').v2;
                    const publicId = event.image.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(`event-management-app/${publicId}`);
                } catch (deleteError) {
                    console.warn('Failed to delete old image:', deleteError.message);
                    // Continue with update even if old image deletion fails
                }
            }
            
            // Set new image URL
            event.image = req.file.secure_url;
        }

        await event.save();
        await event.populate('organizer', 'name email');
        
        res.status(200).json({ 
            success: true, 
            message: 'Event updated successfully',
            event 
        });
    } catch (error) {
        console.error('Update event error:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Validation error',
                details: errors
            });
        }

        res.status(500).json({ 
            success: false, 
            error: 'Internal server error. Please try again later.' 
        });
    }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Events.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ 
                success: false, 
                error: 'Event not found' 
            });
        }

        // Check if the user is the organizer
    if (String(event.organizer) !== req.user._id.toString()) {
            return res.status(403).json({ 
                success: false, 
                error: 'Unauthorized. Only the event organizer can delete this event.' 
            });
        }

        // Delete image from Cloudinary if it exists
        if (event.image) {
            try {
                const cloudinary = require('cloudinary').v2;
              
                const publicId = event.image.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`event-management-app/${publicId}`);
            } catch (deleteError) {
                console.warn('Failed to delete image from Cloudinary:', deleteError.message);
                
            }
        }

        await Events.findByIdAndDelete(req.params.id);
        res.status(200).json({ 
            success: true, 
            message: 'Event deleted successfully' 
        });
    } catch (error) {
        console.error('Delete event error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error. Please try again later.' 
        });
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

