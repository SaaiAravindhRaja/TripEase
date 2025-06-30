const express = require('express');
const HotelController = require('../controllers/HotelController');
const AuthMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/hotels/search
// @desc    Search for hotels
// @access  Public (but booking requires auth)
router.post('/search', 
  HotelController.searchHotels
);

// @route   POST /api/hotels/book
// @desc    Book a hotel
// @access  Private
router.post('/book', 
  AuthMiddleware.authenticate,
  HotelController.bookHotel
);

// @route   GET /api/hotels/bookings
// @desc    Get user's hotel bookings
// @access  Private
router.get('/bookings', 
  AuthMiddleware.authenticate,
  HotelController.getBookings
);

// @route   PUT /api/hotels/bookings/:bookingId/cancel
// @desc    Cancel a hotel booking
// @access  Private
router.put('/bookings/:bookingId/cancel', 
  AuthMiddleware.authenticate,
  HotelController.cancelBooking
);

// @route   GET /api/hotels/destinations/popular
// @desc    Get popular hotel destinations
// @access  Public
router.get('/destinations/popular', 
  HotelController.getPopularDestinations
);

// @route   GET /api/hotels/rating/:minRating
// @desc    Get hotels by minimum rating
// @access  Public
router.get('/rating', 
  HotelController.getHotelsByRating
);

module.exports = router;
