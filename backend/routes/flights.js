const express = require('express');
const FlightController = require('../controllers/FlightController');
const AuthMiddleware = require('../middleware/auth');
const ValidationMiddleware = require('../middleware/validation');

const router = express.Router();

// @route   POST /api/flights/search
// @desc    Search for flights
// @access  Private
router.post('/search', 
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateFlightSearch,
  FlightController.searchFlights
);

// @route   POST /api/flights/book
// @desc    Book a flight
// @access  Private
router.post('/book', 
  AuthMiddleware.authenticate,
  FlightController.bookFlight
);

// @route   GET /api/flights/bookings
// @desc    Get user's flight bookings
// @access  Private
router.get('/bookings', 
  AuthMiddleware.authenticate,
  FlightController.getBookings
);

// @route   PUT /api/flights/bookings/:bookingId/cancel
// @desc    Cancel a flight booking
// @access  Private
router.put('/bookings/:bookingId/cancel', 
  AuthMiddleware.authenticate,
  FlightController.cancelBooking
);

// @route   GET /api/flights/destinations/popular
// @desc    Get popular flight destinations
// @access  Public
router.get('/destinations/popular', 
  FlightController.getPopularDestinations
);

module.exports = router;
