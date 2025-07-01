const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
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
  startDate: { 
    type: Date, 
    required: true 
  },
  endDate: { 
    type: Date, 
    required: true 
  },
  flightBooking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FlightBooking', 
    required: false 
  },
  hotelBooking: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'HotelBooking', 
    required: false 
  },
  itinerary: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Itinerary', 
    required: false 
  },
  status: {
    type: String,
    enum: ['planning', 'confirmed', 'completed', 'cancelled'],
    default: 'planning'
  },
  budget: {
    type: Number,
    min: 0
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
TripSchema.index({ userId: 1 });
TripSchema.index({ destination: 1 });
TripSchema.index({ startDate: 1, endDate: 1 });
TripSchema.index({ status: 1 });

// Validate that endDate is after startDate
TripSchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Trip', TripSchema);
