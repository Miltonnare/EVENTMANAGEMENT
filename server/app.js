const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/event');
const eventRegRoutes = require('./routes/registration');

const app = express();

app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        
        const allowedOriginsString = process.env.ALLOWED_ORIGINS || ''; 
        
        
        const allowedOrigins = allowedOriginsString.split(',').map(url => url.trim().replace(/\/$/, ''));
        

        if (!origin) return callback(null, true);
        
        
        const normalizedOrigin = origin.replace(/\/$/, '');
        
      
        if (allowedOrigins.includes(normalizedOrigin)) {
            return callback(null, true);
        } else {
            const msg = `The CORS policy for this site does not allow access from the origin: ${origin}. Allowed: ${allowedOriginsString}`;
            return callback(new Error(msg), false);
        }
    },
    credentials: true,
    methods: ['POST', 'GET', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/eventRegistration', eventRegRoutes);

app.get('/', (req, res) => {
    res.send('Events APP Running Successfully');
});

module.exports = app;