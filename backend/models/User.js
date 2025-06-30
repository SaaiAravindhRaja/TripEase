const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  registeredDate: { 
    type: Date, 
    default: Date.now 
  },
  flightBookings: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'FlightBooking' 
  }],
  hotelBookings: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'HotelBooking' 
  }],
  itineraries: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Itinerary' 
  }],
  trips: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Trip' 
  }],
}, {
  timestamps: true
});

// Add indexes for better performance
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
