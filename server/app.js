const express=require('express');
const cors=require('cors');
const path = require('path');

const authRoutes=require('./routes/auth');
const eventsRoutes=require('./routes/event');
const eventRegRoutes=require('./routes/registration');

const app=express();


app.use(express.json());
app.use(cors({
    origin:function(origin,callback){
        const allowedOrigins=process.env.CLIENT_URL;

        if (!origin) return callback
        const normalizedOrigin=origin.replace(/\/$/,'');
        const normalizedAllowed=allowedOrigins.map(url=>url.replace(/\/$/,''));

        if(normalizedAllowed.includes(normalizedOrign)){
            return callback(null,true);
        }
        callback(new Error('Not Allowed by CORS'))
    },
    credentials: true,
    methods: [
        'POST', 'GET', 'PUT', 'PATCH', 'DELETE'
    ],
    allowedHeaders: [
        'Content-Type',
        'Authorization'
    ]
}));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/auth',authRoutes);
app.use('/api/events',eventsRoutes);
app.use('/api/eventRegistration',eventRegRoutes);
app.get('/',(req,res)=>{
    res.send('Events APP Running Succesfully');
});

module.exports=app;