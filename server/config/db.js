const mongoose=require('mongoose');

const connectDb= async (req,res)=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URI);
        console.log('`MongoDb Connected:${conn.connection.host}`');
        
    } catch (error) {

        console.error(`MongoDb Connection Failed:&{error.message}`);
        process.exit(1);
        
    }
};

module.exports=connectDb;