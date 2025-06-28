const express = require('express');
const cors = require('cors');
const path = require('path');
const mockData = require('./src/mockData');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for bookings
let flightBookings = [];
let hotelBookings = [];
let userItineraries = [];

// Flight APIs
app.get('/api/flights/search', (req, res) => {
  const { from, to, departure, returnDate, passengers } = req.query;
  
  // Simulate flight search with mock data
  const flights = mockData.flights.filter(flight => 
    flight.from.toLowerCase().includes(from.toLowerCase()) &&
    flight.to.toLowerCase().includes(to.toLowerCase())
  );
  
  // Add price variation based on date and passengers
  const resultsWithPricing = flights.map(flight => ({
    ...flight,
    price: flight.basePrice + (Math.random() * 200),
    passengers: parseInt(passengers) || 1
  }));
  
  res.json({
    flights: resultsWithPricing.sort((a, b) => a.price - b.price),
    searchParams: { from, to, departure, returnDate, passengers }
  });
});

app.post('/api/flights/book', (req, res) => {
  const { flightId, passengerInfo, totalPrice } = req.body;
  
  const booking = {
    id: Date.now(),
    flightId,
    passengerInfo,
    totalPrice,
    bookingDate: new Date(),
    status: 'confirmed'
  };
  
  flightBookings.push(booking);
  
  res.json({
    success: true,
    booking,
    confirmationNumber: `FL${booking.id}`
  });
});

// Hotel APIs
app.get('/api/hotels/search', (req, res) => {
  const { destination, checkin, checkout, guests } = req.query;
  
  const hotels = mockData.hotels.filter(hotel =>
    hotel.city.toLowerCase().includes(destination.toLowerCase())
  );
  
  const resultsWithAvailability = hotels.map(hotel => ({
    ...hotel,
    pricePerNight: hotel.basePrice + (Math.random() * 100),
    available: Math.random() > 0.1 // 90% availability
  }));
  
  res.json({
    hotels: resultsWithAvailability.sort((a, b) => a.pricePerNight - b.pricePerNight),
    searchParams: { destination, checkin, checkout, guests }
  });
});

app.post('/api/hotels/book', (req, res) => {
  const { hotelId, checkin, checkout, guests, totalPrice } = req.body;
  
  const booking = {
    id: Date.now(),
    hotelId,
    checkin,
    checkout,
    guests,
    totalPrice,
    bookingDate: new Date(),
    status: 'confirmed'
  };
  
  hotelBookings.push(booking);
  
  res.json({
    success: true,
    booking,
    confirmationNumber: `HT${booking.id}`
  });
});

// Tourist Hotspots API
app.get('/api/destinations/:city/hotspots', (req, res) => {
  const { city } = req.params;
  
  const hotspots = mockData.touristHotspots.filter(spot =>
    spot.city.toLowerCase() === city.toLowerCase()
  );
  
  res.json({
    city,
    hotspots: hotspots.sort((a, b) => b.rating - a.rating)
  });
});

// AI Itinerary Generation
app.post('/api/itinerary/generate', (req, res) => {
  const { destination, duration, interests, budget } = req.body;
  
  // Simulate AI itinerary generation
  const hotspots = mockData.touristHotspots.filter(spot =>
    spot.city.toLowerCase() === destination.toLowerCase()
  );
  
  const itinerary = {
    id: Date.now(),
    destination,
    duration: parseInt(duration),
    totalBudget: budget,
    days: []
  };
  
  // Generate daily activities
  for (let day = 1; day <= parseInt(duration); day++) {
    const dayActivities = hotspots.slice((day - 1) * 2, day * 2).map(spot => ({
      time: day === 1 ? '09:00 AM' : ['10:00 AM', '02:00 PM'][Math.floor(Math.random() * 2)],
      activity: spot.name,
      description: spot.description,
      estimatedCost: Math.floor(Math.random() * 50) + 10,
      duration: `${Math.floor(Math.random() * 3) + 1} hours`
    }));
    
    itinerary.days.push({
      day,
      date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000).toLocaleDateString(),
      activities: dayActivities,
      dailyBudget: Math.floor(budget / parseInt(duration))
    });
  }
  
  userItineraries.push(itinerary);
  
  res.json({
    success: true,
    itinerary
  });
});

// Get user's bookings and itineraries
app.get('/api/user/bookings', (req, res) => {
  res.json({
    flights: flightBookings,
    hotels: hotelBookings,
    itineraries: userItineraries
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to use the app`);
});