const mongoose = require('mongoose');

// Activity sub-schema for better Mongoose handling
const ActivitySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  time: { 
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  }
}, { _id: false }); // _id: false means Mongoose won't automatically create _id for subdocuments

const ItinerarySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
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
  days: [{
    date: { 
      type: Date, 
      required: true 
    },
    activities: [ActivitySchema]
  }],
  generatedDate: { 
    type: Date, 
    default: Date.now 
  },
  title: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Add indexes for better performance
ItinerarySchema.index({ userId: 1 });
ItinerarySchema.index({ destination: 1 });
ItinerarySchema.index({ startDate: 1, endDate: 1 });

// Validate that endDate is after startDate
ItinerarySchema.pre('save', function(next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

module.exports = mongoose.model('Itinerary', ItinerarySchema);
