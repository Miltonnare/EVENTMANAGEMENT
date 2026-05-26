const mongoose = require('mongoose');

const ticketTypeSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Events',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Ticket name is required'],
      trim: true,
      maxlength: 100,
    },
    category: {
      type: String,
      enum: ['free', 'paid', 'vip', 'early_bird'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    quantity: {
      type: Number,
      min: 1,
      default: null,
    },
    soldCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    salesCloseDate: {
      type: Date,
    },
    dynamicPricing: {
      enabled: { type: Boolean, default: false },
      minPrice: { type: Number, min: 0 },
      maxPrice: { type: Number, min: 0 },
      increasePerTenPercentSold: { type: Number, min: 0, default: 0 },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ticketTypeSchema.virtual('available').get(function available() {
  if (this.quantity == null) return null;
  return Math.max(0, this.quantity - this.soldCount);
});

module.exports = mongoose.model('TicketType', ticketTypeSchema);
