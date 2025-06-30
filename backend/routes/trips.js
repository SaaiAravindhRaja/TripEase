const express = require('express');
const TripController = require('../controllers/TripController');
const AuthMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/trips/create
// @desc    Create a new trip
// @access  Private
router.post('/create', 
  AuthMiddleware.authenticate,
  TripController.createTrip
);

// @route   POST /api/trips/finalize
// @desc    Finalize a trip with all components
// @access  Private
router.post('/finalize', 
  AuthMiddleware.authenticate,
  TripController.finalizeTrip
);

// @route   GET /api/trips
// @desc    Get user's trips
// @access  Private
router.get('/', 
  AuthMiddleware.authenticate,
  TripController.getTrips
);

// @route   GET /api/trips/:tripId
// @desc    Get a specific trip with full details
// @access  Private
router.get('/:tripId', 
  AuthMiddleware.authenticate,
  TripController.getTrip
);

// @route   PUT /api/trips/:tripId
// @desc    Update a trip
// @access  Private
router.put('/:tripId', 
  AuthMiddleware.authenticate,
  TripController.updateTrip
);

// @route   DELETE /api/trips/:tripId
// @desc    Delete a trip and all associated data
// @access  Private
router.delete('/:tripId', 
  AuthMiddleware.authenticate,
  TripController.deleteTrip
);

module.exports = router;
