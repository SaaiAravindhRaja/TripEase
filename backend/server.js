// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all routes (adjust for production)
app.use(express.json()); // Body parser for JSON requests

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process with failure
});

// --- MongoDB Schemas & Models ---

// User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registeredDate: { type: Date, default: Date.now },
  flightBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlightBooking' }],
  hotelBookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'HotelBooking' }],
  itineraries: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary' }],
  trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }], // Add trips reference
});
const User = mongoose.model('User', UserSchema);

// Flight Booking Schema
const FlightBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  departureDate: { type: Date, required: true },
  returnDate: { type: Date },
  airline: { type: String },
  price: { type: Number },
  bookingDate: { type: Date, default: Date.now },
});
const FlightBooking = mongoose.model('FlightBooking', FlightBookingSchema);

// Hotel Booking Schema
const HotelBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  hotelName: { type: String, required: true },
  destination: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  pricePerNight: { type: Number },
  bookingDate: { type: Date, default: Date.now },
});
const HotelBooking = mongoose.model('HotelBooking', HotelBookingSchema);


// NEW: Define the Activity sub-schema for better Mongoose handling
const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String },
}, { _id: false }); // _id: false means Mongoose won't automatically create _id for these subdocuments

// Itinerary Schema (MODIFIED to use ActivitySchema)
const ItinerarySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  days: [
    {
      date: { type: Date, required: true },
      activities: [ActivitySchema] // <-- Now uses the defined ActivitySchema
    }
  ],
  generatedDate: { type: Date, default: Date.now },
});
const Itinerary = mongoose.model('Itinerary', ItinerarySchema);

// Trip Schema (no changes needed here from previous iteration)
const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true }, // e.g., "Trip to LAX"
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  flightBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'FlightBooking', required: false },
  hotelBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'HotelBooking', required: false },
  itinerary: { type: mongoose.Schema.Types.ObjectId, ref: 'Itinerary', required: false },
  createdAt: { type: Date, default: Date.now },
});
const Trip = mongoose.model('Trip', TripSchema);


// --- Fake Data Storage (for demonstration purposes) ---
const fakeFlights = [
  { id: 'f1', origin: 'NYC', destination: 'LAX', airline: 'AirDemo', price: 250, departureTime: '08:00 AM', arrivalTime: '11:00 AM', departureDate: '2025-08-01', returnDate: '2025-08-05' },
  { id: 'f2', origin: 'NYC', destination: 'LAX', airline: 'FlySim', price: 300, departureTime: '10:00 AM', arrivalTime: '01:00 PM', departureDate: '2025-08-01', returnDate: '2025-08-05' },
  { id: 'f3', origin: 'LAX', destination: 'SFX', airline: 'AirDemo', price: 100, departureTime: '09:00 AM', arrivalTime: '10:30 AM', departureDate: '2025-09-10', returnDate: '2025-09-15' },
  { id: 'f4', origin: 'NYC', destination: 'MIA', airline: 'FlySim', price: 180, departureTime: '07:00 AM', arrivalTime: '10:00 AM', departureDate: '2025-10-20', returnDate: '2025-10-25' },
  { id: 'f5', origin: 'NYC', destination: 'PAR', airline: 'GlobalAir', price: 700, departureTime: '06:00 PM', arrivalTime: '08:00 AM (+1 day)', departureDate: '2025-11-01', returnDate: '2025-11-07' },
];

const fakeHotels = [
  { id: 'h1', name: 'Grand Los Angeles Hotel', destination: 'LAX', rating: 4, pricePerNight: 150, address: '123 Hollywood Blvd' },
  { id: 'h2', name: 'Downtown LA Inn', destination: 'LAX', rating: 3, pricePerNight: 100, address: '456 City Center' },
  { id: 'h3', name: 'San Francisco Bay View', destination: 'SFX', rating: 5, pricePerNight: 250, address: '789 Pier St' },
  { id: 'h4', name: 'Miami Beach Resort', destination: 'MIA', rating: 4, pricePerNight: 200, address: '101 Ocean Drive' },
  { id: 'h5', name: 'Parisian Charm Hotel', destination: 'PAR', rating: 4, pricePerNight: 300, address: 'Arc de Triomphe Area' },
];

const fakePOIs = [
  { id: 'p1', name: 'Hollywood Walk of Fame', type: 'Landmark', description: 'Famous sidewalk with stars', destination: 'LAX' },
  { id: 'p2', name: 'Griffith Observatory', type: 'Attraction', description: 'Views of Hollywood sign and city', destination: 'LAX' },
  { id: 'p3', name: 'Golden Gate Bridge', type: 'Landmark', description: 'Iconic suspension bridge', destination: 'SFX' },
  { id: 'p4', name: 'Alcatraz Island', type: 'Attraction', description: 'Historic prison island', destination: 'SFX' },
  { id: 'p5', name: 'South Beach', type: 'Beach', description: 'Vibrant beach area', destination: 'MIA' },
  { id: 'p6', name: 'Art Deco Historic District', type: 'Culture', description: 'Colorful architecture', destination: 'MIA' },
  { id: 'p7', name: 'Eiffel Tower', type: 'Landmark', description: 'Iconic iron tower', destination: 'PAR' },
  { id: 'p8', name: 'Louvre Museum', type: 'Museum', description: 'World-renowned art museum', destination: 'PAR' },
];

// --- Middleware for JWT Authentication ---
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Expects "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // Attach user payload (user ID) to request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// --- Helper Functions for AI-like Logic (Fake Data Based) ---

// Simulates generating an "ideal" itinerary
const generateFakeItinerary = (destination, startDate, endDate) => {
  const itinerary = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  let currentDate = new Date(start);

  const getActivitiesForDestination = (dest) => {
    switch (dest.toUpperCase()) {
      case 'LAX':
        return [
          { name: 'Hollywood Walk of Fame', time: 'Morning' },
          { name: 'Griffith Observatory', time: 'Afternoon' },
          { name: 'Santa Monica Pier', time: 'Evening' },
        ];
      case 'SFX':
        return [
          { name: 'Golden Gate Bridge', time: 'Morning' },
          { name: 'Alcatraz Island Tour', time: 'Afternoon' },
          { name: 'Fisherman\'s Wharf', time: 'Evening' },
        ];
      case 'MIA':
        return [
          { name: 'South Beach', time: 'Morning' },
          { name: 'Art Deco Historic District Tour', time: 'Afternoon' },
          { name: 'Everglades National Park (Day Trip)', time: 'Full Day' },
        ];
      case 'PAR':
        return [
          { name: 'Eiffel Tower & Champ de Mars', time: 'Morning' },
          { name: 'Louvre Museum', time: 'Afternoon' },
          { name: 'Seine River Cruise', time: 'Evening' },
          { name: 'Notre Dame Cathedral', time: 'Morning' },
          { name: 'Montmartre & Sacré-Cœur Basilica', time: 'Afternoon' },
          { name: 'Latin Quarter & Pantheon', time: 'Evening' },
        ];
      default:
        return [
          { name: 'Explore City Center', time: 'Morning' },
          { name: 'Visit Local Park', time: 'Afternoon' },
          { name: 'Enjoy Local Cuisine', time: 'Evening' },
        ];
    }
  };

  const possibleActivities = getActivitiesForDestination(destination);

  while (currentDate <= end) {
    const activities = [];
    // Ensure unique activities per day for variety if possible
    const availableActivities = [...possibleActivities];
    for (let i = 0; i < Math.min(3, availableActivities.length); i++) {
        const randomIndex = Math.floor(Math.random() * availableActivities.length);
        activities.push(availableActivities.splice(randomIndex, 1)[0]);
    }

    itinerary.push({
      date: currentDate.toISOString().split('T')[0], //YYYY-MM-DD
      activities: activities,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return itinerary;
};

// Simulates tourist destination recommendations
const getFakeTouristRecommendations = (destination) => {
  switch (destination.toUpperCase()) {
    case 'LAX':
      return {
        touristDestinations: ['Universal Studios Hollywood', 'Getty Center', 'Disneyland Park'],
        fastestRoute: 'From Downtown LA: Take Metro Red Line to Universal City/Studio City Station (approx. 20 min).',
      };
    case 'SFX':
      return {
        touristDestinations: ['Pier 39', 'Lombard Street', 'Chinatown'],
        fastestRoute: 'From Union Square: Take Powell-Hyde Cable Car to Lombard Street (approx. 15 min).',
      };
    case 'MIA':
        return {
          touristDestinations: ['Vizcaya Museum & Gardens', 'Wynwood Walls', 'Little Havana'],
          fastestRoute: 'From South Beach: Take the free trolley to Lincoln Road Mall, then taxi/ride-share (approx. 20 min).',
        };
    case 'PAR':
        return {
          touristDestinations: ['Champs-Élysées', 'Arc de Triomphe', 'Musée d\'Orsay'],
          fastestRoute: 'From Eiffel Tower: Take Metro Line 9 from Trocadéro to Franklin D. Roosevelt for Champs-Élysées (approx. 10 min).',
        };
    default:
      return {
        touristDestinations: ['Local Market', 'Botanical Garden', 'Historic District'],
        fastestRoute: 'Walk or use public transport, check local transit apps for real-time data.',
      };
  }
};


// --- API Routes ---

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
app.post('/api/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '2h' }, // Token expires in 2 hours
      (err, token) => {
        if (err) throw err;
        res.json({ token, message: 'Logged in successfully' });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/flights/search
// @desc    Search for flights (fake data)
// @access  Private
app.post('/api/flights/search', authMiddleware, (req, res) => {
  const { origin, destination, departureDate, returnDate } = req.body;
  const foundFlights = fakeFlights.filter(f =>
    f.origin.toLowerCase() === origin.toLowerCase() &&
    f.destination.toLowerCase() === destination.toLowerCase() &&
    f.departureDate === departureDate &&
    (returnDate ? f.returnDate === returnDate : true)
  );

  if (foundFlights.length > 0) {
    res.json({ flights: foundFlights, message: 'Flights found!' });
  } else {
    res.status(404).json({ message: 'No flights found for your criteria. Try NYC to LAX for 2025-08-01.' });
  }
});

// @route   POST /api/flights/book
// @desc    Book a flight (simulation)
// @access  Private
app.post('/api/flights/book', authMiddleware, async (req, res) => {
  const { flightId } = req.body;
  const userId = req.user.id;
  const flight = fakeFlights.find(f => f.id === flightId);

  if (!flight) {
    return res.status(404).json({ message: 'Flight not found.' });
  }

  try {
    const newBooking = new FlightBooking({
      userId,
      origin: flight.origin,
      destination: flight.destination,
      departureDate: new Date(flight.departureDate),
      returnDate: flight.returnDate ? new Date(flight.returnDate) : undefined,
      airline: flight.airline,
      price: flight.price,
    });
    await newBooking.save();

    await User.findByIdAndUpdate(userId, { $push: { flightBookings: newBooking._id } });

    res.status(200).json({ message: `Flight ${flight.airline} to ${flight.destination} booked successfully!`, flightBookingId: newBooking._id });
  } catch (error) {
    console.error('Error booking flight:', error);
    res.status(500).json({ message: 'Failed to book flight due to server error.' });
  }
});

// @route   POST /api/hotels/search
// @desc    Search for hotels (fake data)
// @access  Public (no auth needed for search, but for booking)
app.post('/api/hotels/search', (req, res) => {
  const { destination } = req.body; // checkInDate and checkOutDate for context
  const foundHotels = fakeHotels.filter(h => h.destination.toLowerCase() === destination.toLowerCase());

  if (foundHotels.length > 0) {
    res.json({ hotels: foundHotels, message: 'Hotels found!' });
  } else {
    res.status(404).json({ message: `No hotels found in ${destination}.` });
  }
});

// @route   POST /api/hotels/book
// @desc    Book a hotel (simulation)
// @access  Private
app.post('/api/hotels/book', authMiddleware, async (req, res) => {
  const { hotelId, checkInDate, checkOutDate } = req.body; // Make sure dates are here
  const userId = req.user.id;
  const hotel = fakeHotels.find(h => h.id === hotelId);

  if (!hotel) {
    return res.status(404).json({ message: 'Hotel not found.' });
  }

  try {
    const newBooking = new HotelBooking({
      userId,
      hotelName: hotel.name,
      destination: hotel.destination,
      checkInDate: new Date(checkInDate), // Use passed dates
      checkOutDate: new Date(checkOutDate), // Use passed dates
      pricePerNight: hotel.pricePerNight,
    });
    await newBooking.save();

    await User.findByIdAndUpdate(userId, { $push: { hotelBookings: newBooking._id } });

    res.status(200).json({ message: `Hotel ${hotel.name} booked successfully!`, hotelBookingId: newBooking._id });
  }
  catch (error) {
    console.error('Error booking hotel:', error);
    res.status(500).json({ message: 'Failed to book hotel due to server error.' });
  }
});

// @route   POST /api/itinerary/generate
// @desc    Generate a suggested travel itinerary (fake AI logic)
// @access  Private
app.post('/api/itinerary/generate', authMiddleware, async (req, res) => {
  const { destination, departureDate, returnDate, hotelName } = req.body;
  // userId from req.user.id is not directly used here, but middleware still protects
  if (!destination || !departureDate || !returnDate) {
    return res.status(400).json({ message: 'Destination and dates are required to generate an itinerary.' });
  }

  const itineraryDays = generateFakeItinerary(destination, departureDate, returnDate);
  const recommendations = getFakeTouristRecommendations(destination);

  // We are NOT saving the itinerary to DB here. It's returned for frontend modification.
  // The itinerary will be saved to the DB ONLY when the trip is finalized via /api/trips/finalize.

  res.json({
    message: 'Itinerary generated successfully!',
    itinerary: itineraryDays,
    recommendations: recommendations,
  });
});

// @route   GET /api/poi/search
// @desc    Search for Points of Interest (POIs) (fake data)
// @access  Public
app.get('/api/poi/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const foundPOIs = fakePOIs.filter(poi =>
    poi.name.toLowerCase().includes(query) ||
    poi.type.toLowerCase().includes(query) ||
    poi.description.toLowerCase().includes(query) ||
    poi.destination.toLowerCase().includes(query) // Can search across destinations
  );
  res.json({ pois: foundPOIs });
});

// @route   POST /api/trips/finalize
// @desc    Saves the *finalized* itinerary and creates the main Trip document
// @access  Private
app.post('/api/trips/finalize', authMiddleware, async (req, res) => {
  const { destination, departureDate, returnDate, hotelName, finalItinerary, flightBookingId, hotelBookingId } = req.body;
  const userId = req.user.id;

  if (!destination || !departureDate || !returnDate || !finalItinerary) {
    return res.status(400).json({ message: 'Missing required trip details for finalization.' });
  }

  try {
    // 1. Save the final itinerary (which could have been modified by the user)
    const newItinerary = new Itinerary({
      userId,
      destination,
      startDate: new Date(departureDate),
      endDate: new Date(returnDate),
      days: finalItinerary, // Use the (potentially modified) itinerary from frontend
    });
    await newItinerary.save();

    await User.findByIdAndUpdate(userId, { $push: { itineraries: newItinerary._id } });

    // 2. Create the Trip document linking everything
    const newTrip = new Trip({
      userId,
      name: `Trip to ${destination} (${new Date(departureDate).toLocaleDateString()})`, // Example name
      destination,
      startDate: new Date(departureDate),
      endDate: new Date(returnDate),
      // Ensure IDs are cast to ObjectId or null if not provided, Mongoose handles undefined well.
      flightBooking: flightBookingId || null,
      hotelBooking: hotelBookingId || null,
      itinerary: newItinerary._id, // Link to the newly saved itinerary
    });
    await newTrip.save();

    await User.findByIdAndUpdate(userId, { $push: { trips: newTrip._id } }); // Add trip to user's list of trips

    res.json({
      message: 'Trip finalized and saved!',
      tripId: newTrip._id, // RETURN THE NEW TRIP ID to the frontend
    });
  }
  catch (error) {
    console.error('Error finalizing trip:', error);
    res.status(500).json({ message: 'Failed to finalize trip due to server error.' });
  }
});


// @route   GET /api/trips/my-trips
// @desc    Get all trips for a logged-in user (summary view)
// @access  Private
app.get('/api/trips/my-trips', authMiddleware, async (req, res) => {
  try {
    const trips = await Trip.find({ userId: req.user.id })
                            .sort({ createdAt: -1 }) // Sort by newest first
                            .select('name destination startDate endDate'); // Select only summary fields to keep data light
    res.json({ trips });
  }
  catch (error) {
    console.error('Error fetching user trips:', error);
    res.status(500).json({ message: 'Failed to fetch trips.' });
  }
});

// @route   GET /api/trips/:tripId
// @desc    Get a single trip with all populated details (flight, hotel, itinerary)
// @access  Private
app.get('/api/trips/:tripId', authMiddleware, async (req, res) => {
  try {
    // Populate linked documents to send full details to frontend
    const trip = await Trip.findOne({ _id: req.params.tripId, userId: req.user.id })
                           .populate('flightBooking')
                           .populate('hotelBooking')
                           .populate('itinerary');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found or unauthorized.' });
    }
    res.json({ trip });
  }
  catch (error) {
    console.error('Error fetching single trip:', error);
    res.status(500).json({ message: 'Failed to fetch trip details.' });
  }
});

// NEW API ENDPOINT: DELETE /api/trips/:tripId
// @route   DELETE /api/trips/:tripId
// @desc    Cancel (delete) a trip and its associated data
// @access  Private
app.delete('/api/trips/:tripId', authMiddleware, async (req, res) => {
  const { tripId } = req.params;
  const userId = req.user.id;

  try {
    // Find the trip and ensure it belongs to the logged-in user
    const tripToDelete = await Trip.findOne({ _id: tripId, userId: userId });

    if (!tripToDelete) {
      return res.status(404).json({ message: 'Trip not found or you are not authorized to delete it.' });
    }

    // 1. Delete associated Flight Booking (if exists)
    if (tripToDelete.flightBooking) {
      await FlightBooking.findByIdAndDelete(tripToDelete.flightBooking);
      // Remove from user's array as well (optional, but good for consistency)
      await User.findByIdAndUpdate(userId, { $pull: { flightBookings: tripToDelete.flightBooking } });
    }

    // 2. Delete associated Hotel Booking (if exists)
    if (tripToDelete.hotelBooking) {
      await HotelBooking.findByIdAndDelete(tripToDelete.hotelBooking);
      // Remove from user's array as well
      await User.findByIdAndUpdate(userId, { $pull: { hotelBookings: tripToDelete.hotelBooking } });
    }

    // 3. Delete associated Itinerary (if exists)
    if (tripToDelete.itinerary) {
      await Itinerary.findByIdAndDelete(tripToDelete.itinerary);
      // Remove from user's array as well
      await User.findByIdAndUpdate(userId, { $pull: { itineraries: tripToDelete.itinerary } });
    }

    // 4. Delete the Trip document itself
    await Trip.findByIdAndDelete(tripId);
    // Remove from user's array
    await User.findByIdAndUpdate(userId, { $pull: { trips: tripId } });


    res.status(200).json({ message: 'Trip and all associated data cancelled successfully!' });

  } catch (error) {
    console.error('Error cancelling trip:', error);
    res.status(500).json({ message: 'Failed to cancel trip due to server error.' });
  }
});


// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});