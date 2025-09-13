
const mongoose = require('mongoose');

const eventsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Event title is required'],
        trim: true,
        minlength: [3, 'Event title must be at least 3 characters long'],
        maxlength: [100, 'Event title cannot exceed 100 characters'],
        validate: {
            validator: function(v) {
                return /^[a-zA-Z0-9\s\-_.,!?()]+$/.test(v);
            },
            message: 'Event title contains invalid characters'
        }
    },
    description: {
        type: String,
        required: [true, 'Event description is required'],
        trim: true,
        minlength: [10, 'Event description must be at least 10 characters long'],
        maxlength: [2000, 'Event description cannot exceed 2000 characters']
    },
    date: {
        type: Date,
        required: [true, 'Event date is required'],
        validate: {
            validator: function(v) {
                return v > new Date();
            },
            message: 'Event date must be in the future'
        }
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
        minlength: [3, 'Location must be at least 3 characters long'],
        maxlength: [200, 'Location cannot exceed 200 characters']
    },
    capacity: {
        type: Number,
        required: false,
        min: [1, 'Capacity must be at least 1'],
        max: [10000, 'Capacity cannot exceed 10,000'],
        validate: {
            validator: function(v) {
                return v === null || v === undefined || (Number.isInteger(v) && v > 0);
            },
            message: 'Capacity must be a positive integer'
        }
    },
    image: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                // Validate Cloudinary URL format
                return /^https:\/\/res\.cloudinary\.com\/[a-zA-Z0-9]+\/image\/upload\/.*$/.test(v);
            },
            message: 'Invalid image URL format'
        }
    },
    qrCode: {
        type: String,
        validate: {
            validator: function(v) {
                if (!v) return true; // Optional field
                // Validate base64 data URL format
                return /^data:image\/png;base64,/.test(v);
            },
            message: 'Invalid QR code format'
        }
    },
    organizer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Event organizer is required']
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active'
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [20, 'Tag cannot exceed 20 characters']
    }]
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for attendee count
eventsSchema.virtual('attendeeCount').get(function() {
    return this.attendees ? this.attendees.length : 0;
});

// Virtual for checking if event is full
eventsSchema.virtual('isFull').get(function() {
    if (!this.capacity) return false;
    return this.attendeeCount >= this.capacity;
});

// Virtual for checking if event is available for registration
eventsSchema.virtual('isAvailable').get(function() {
    return this.status === 'active' && !this.isFull && this.date > new Date();
});

// Index for better query performance
eventsSchema.index({ organizer: 1 });
eventsSchema.index({ date: 1 });
eventsSchema.index({ status: 1 });
eventsSchema.index({ location: 'text', title: 'text', description: 'text' });

// Pre-save middleware to validate capacity vs attendees
eventsSchema.pre('save', function(next) {
    if (this.capacity && this.attendees && this.attendees.length > this.capacity) {
        return next(new Error('Number of attendees cannot exceed event capacity'));
    }
    next();
});

// Pre-remove middleware to clean up related data
eventsSchema.pre('remove', async function(next) {
    try {
        // Remove this event from all users' registered events
        await mongoose.model('User').updateMany(
            { registeredEvents: this._id },
            { $pull: { registeredEvents: this._id } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Events', eventsSchema);
