const mongoose = require('mongoose');

const HotelBookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  hotelName: { 
    type: String, 
    required: true,
    trim: true
  },
  destination: { 
    type: String, 
    required: true,
    uppercase: true,
    trim: true
  },
  checkInDate: { 
    type: Date, 
    required: true 
  },
  checkOutDate: { 
    type: Date, 
    required: true 
  },
  pricePerNight: { 
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
  },
  guests: {
    type: Number,
    default: 1,
    min: 1
  }
}, {
  timestamps: true
});

// Add indexes for better performance
HotelBookingSchema.index({ userId: 1 });
HotelBookingSchema.index({ checkInDate: 1 });
HotelBookingSchema.index({ destination: 1 });

// Validate that checkOutDate is after checkInDate
HotelBookingSchema.pre('save', function(next) {
  if (this.checkOutDate <= this.checkInDate) {
    next(new Error('Check-out date must be after check-in date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('HotelBooking', HotelBookingSchema);
