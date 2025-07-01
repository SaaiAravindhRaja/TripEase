const express = require('express');
const ItineraryController = require('../controllers/ItineraryController');
const AuthMiddleware = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/itinerary/generate
// @desc    Generate a suggested travel itinerary
// @access  Private
router.post('/generate', 
  AuthMiddleware.authenticate,
  ItineraryController.generateItinerary
);

// @route   POST /api/itinerary/save
// @desc    Save an itinerary
// @access  Private
router.post('/save', 
  AuthMiddleware.authenticate,
  ItineraryController.saveItinerary
);

// @route   GET /api/itinerary
// @desc    Get user's itineraries
// @access  Private
router.get('/', 
  AuthMiddleware.authenticate,
  ItineraryController.getItineraries
);

// @route   GET /api/itinerary/:itineraryId
// @desc    Get a specific itinerary
// @access  Private
router.get('/:itineraryId', 
  AuthMiddleware.authenticate,
  ItineraryController.getItinerary
);

// @route   PUT /api/itinerary/:itineraryId
// @desc    Update an itinerary
// @access  Private
router.put('/:itineraryId', 
  AuthMiddleware.authenticate,
  ItineraryController.updateItinerary
);

// @route   DELETE /api/itinerary/:itineraryId
// @desc    Delete an itinerary
// @access  Private
router.delete('/:itineraryId', 
  AuthMiddleware.authenticate,
  ItineraryController.deleteItinerary
);

module.exports = router;
