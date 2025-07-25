const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');

const userSchema=new mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Name is required']
        },
        email:{
            type:String,
            required:[true,'Email is required'],
            unique:true,
            lowercase:true
        },
        phone:{
            type:String,
            required:[true,'Phone Number is required'],

        },
        role:{
            type:String,
            enum:['attendee','organizer'],
            default:'attendee',
        },
        password:{
            type:String,
            required:[true,'Password is Required'],
            minlength:6
        },
    },
    {timestamps:true}
);

userSchema.pre('save',async (next)=>{
    if(!this.isModified('password'))
        return next();

    const salt=password.genSalt(10);
    this.password=await bcrypt.hash(this.password,salt);
    next();

})

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
