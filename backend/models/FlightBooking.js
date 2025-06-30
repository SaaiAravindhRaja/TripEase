const mongoose = require('mongoose');

const FlightBookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  origin: { 
    type: String, 
    required: true,
    uppercase: true,
    trim: true
  },
  destination: { 
    type: String, 
    required: true,
    uppercase: true,
    trim: true
  },
  departureDate: { 
    type: Date, 
    required: true 
  },
  returnDate: { 
    type: Date 
  },
  airline: { 
    type: String,
    trim: true
  },
  price: { 
    type: Number,
    min: 0
  },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});


FlightBookingSchema.index({ userId: 1 });
FlightBookingSchema.index({ departureDate: 1 });
FlightBookingSchema.index({ origin: 1, destination: 1 });

module.exports = mongoose.model('FlightBooking', FlightBookingSchema);
