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
         const events = await Event.find().populate('organizer', 'name email');
         res.status(200).json({success:true,events})
        
    } catch (error) {
        res.status(500).json({success:false,error:error.message});
        
    }
};

