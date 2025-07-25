const jwt=require('jsonwebtoken');
const User=require('../models/User');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
};

const register=async (req,res)=>{
    const {name,email,password,phone,role}=req.body;

    if(!name||!email||phone||password){
        return res.status(400).json({message:'All fields are required'});

    }
    try {
        const existingUser=await User.findOne({email});
        if(existingUser){
            res.status(409).json({message:'Email already used'});
        }

        const user=await User.create({name,email,phone,password,role});
        res.status(201).json({
            message:'User created succesfully',
            token:generateToken(user),
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                role:user.role,
            },
        });
        
    } catch (error) {
        res.status(500).json({message:'server error', error:error.message})
        
    }
};

