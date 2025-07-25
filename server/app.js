const express=require('express');
const cors=require('cors');

const authRoutes=require('./routes/auth');

const app=express();


app.use(express.json());
app.use(cors());

app.use('api/auth',authRoutes);

app.get('/',(req,res)=>{
    res.send('Events APP Running Succesfully');
});

module.exports=app;