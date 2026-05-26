const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    ticketCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Events',
      required: true,
      index: true,
    },
    ticketType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketType',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TicketPurchase',
      required: true,
    },
    pricePaid: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['valid', 'cancelled', 'used'],
      default: 'valid',
    },
    qrCode: String,
  },
  { timestamps: true }
);

ticketSchema.index({ owner: 1, event: 1 });
ticketSchema.index({ event: 1, status: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);
