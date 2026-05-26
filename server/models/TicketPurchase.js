const mongoose = require('mongoose');

const ticketPurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
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
    tickets: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket',
      },
    ],
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['completed', 'cancelled', 'refunded'],
      default: 'completed',
    },
    purchasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

ticketPurchaseSchema.index({ user: 1, purchasedAt: -1 });

module.exports = mongoose.model('TicketPurchase', ticketPurchaseSchema);
