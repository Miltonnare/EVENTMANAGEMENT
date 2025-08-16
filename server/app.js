const express=require('express');
const cors=require('cors');

const authRoutes=require('./routes/auth');
const eventsRoutes=require('./routes/event');
const eventRegRoutes=require('./routes/registration');

const app=express();


app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: [
        'POST', 'GET', 'PUT', 'PATCH', 'DELETE'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
}));

app.use('/api/auth',authRoutes);
app.use('/api/events',eventsRoutes);
app.use('/api/eventRegistration',eventRegRoutes);
app.get('/',(req,res)=>{
    res.send('Events APP Running Succesfully');
});

module.exports=app;