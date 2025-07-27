
const mongoose=require('mongoose');

const eventsSchema= new mongoose.Schema({
    title:{
        type:String,
        required:[true,'Event title is required'],
        trim:true
    },
    description:{
        type:String,
        required:[true,'Event description is required']
    },
    date:{
        type:Date,
        required:[true,'Event date is required'],

    },

    location:{
        type:String,
        required:[true,'Location is required']
    },
    capacity:{
        type:String,
        required:[false,'Capacity'],
        min:[1,'Atleast one member']
    },
    organizer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }

},{timestamps:true}

)

module.exports=mongoose.model('Events',eventsSchema);
