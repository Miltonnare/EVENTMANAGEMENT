const Event=require('../models/Events');
const User=require('../models/User');

const registerForEvent=async(req,res)=>{
    try {
        const event=await Event.findById(req.params.id);

        if(!event){
            return res.status(404).json({message:'Event not found'});
        }
        if(event.attendees.includes(req.user.id)){
                return res.status(400).json({message:'Already registered for this Event'});
            }

            if(event.attendees.length>event.capacity){
               return res.status(400).json({message:'Event is Full'})
            }

            event.attendees.push(req.user._id);
            await event.save();

            res.status(200).json({message:'Succesfully registered for the event '});
        
    } catch (error) {
        return res.status(500).json({message:'Server error',Error:error.message});
        
    }
};