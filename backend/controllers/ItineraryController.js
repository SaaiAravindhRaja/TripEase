const ItineraryService = require('../services/ItineraryService');
const Itinerary = require('../models/Itinerary');
const User = require('../models/User');

class ItineraryController {
  static async generateItinerary(req, res) {
    try {
      const { destination, departureDate, returnDate, preferences = {} } = req.body;

      // Validate required fields
      if (!destination || !departureDate || !returnDate) {
        return res.status(400).json({ 
          message: 'Destination, departure date, and return date are required' 
        });
      }

      // Generate itinerary using service
      const itineraryDays = ItineraryService.generateItinerary(
        destination, 
        departureDate, 
        returnDate
      );

      // Get tourist recommendations
      const recommendations = ItineraryService.getTouristRecommendations(destination);

      res.json({
        message: 'Itinerary generated successfully!',
        itinerary: {
          destination,
          startDate: departureDate,
          endDate: returnDate,
          days: itineraryDays,
          preferences
        },
        recommendations,
        meta: {
          totalDays: itineraryDays.length,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Generate itinerary error:', error);
      res.status(500).json({ 
        message: 'Failed to generate itinerary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async saveItinerary(req, res) {
    try {
      const { destination, startDate, endDate, days, title, notes = '' } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!destination || !startDate || !endDate || !days) {
        return res.status(400).json({ 
          message: 'Destination, dates, and itinerary days are required' 
        });
      }

      // Create new itinerary
      const newItinerary = new Itinerary({
        userId,
        destination: destination.toUpperCase(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        days,
        title: title || `Trip to ${destination}`,
        notes
      });

      await newItinerary.save();

      // Update user's itineraries
      await User.findByIdAndUpdate(userId, { 
        $push: { itineraries: newItinerary._id } 
      });

      res.status(201).json({ 
        message: 'Itinerary saved successfully!',
        itinerary: newItinerary
      });
    } catch (error) {
      console.error('Save itinerary error:', error);
      res.status(500).json({ 
        message: 'Failed to save itinerary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getItineraries(req, res) {
    try {
      const userId = req.user.id;
      const itineraries = await Itinerary.find({ userId })
        .sort({ createdAt: -1 })
        .select('destination startDate endDate title generatedDate');

      res.json({ 
        itineraries,
        count: itineraries.length
      });
    } catch (error) {
      console.error('Get itineraries error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch itineraries',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getItinerary(req, res) {
    try {
      const { itineraryId } = req.params;
      const userId = req.user.id;

      const itinerary = await Itinerary.findOne({ 
        _id: itineraryId, 
        userId 
      });

      if (!itinerary) {
        return res.status(404).json({ 
          message: 'Itinerary not found or unauthorized' 
        });
      }

      res.json({ itinerary });
    } catch (error) {
      console.error('Get itinerary error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch itinerary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async updateItinerary(req, res) {
    try {
      const { itineraryId } = req.params;
      const { days, title, notes } = req.body;
      const userId = req.user.id;

      const itinerary = await Itinerary.findOneAndUpdate(
        { _id: itineraryId, userId },
        { 
          ...(days && { days }),
          ...(title && { title }),
          ...(notes !== undefined && { notes })
        },
        { new: true }
      );

      if (!itinerary) {
        return res.status(404).json({ 
          message: 'Itinerary not found or unauthorized' 
        });
      }

      res.json({ 
        message: 'Itinerary updated successfully',
        itinerary 
      });
    } catch (error) {
      console.error('Update itinerary error:', error);
      res.status(500).json({ 
        message: 'Failed to update itinerary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async deleteItinerary(req, res) {
    try {
      const { itineraryId } = req.params;
      const userId = req.user.id;

      const itinerary = await Itinerary.findOneAndDelete({ 
        _id: itineraryId, 
        userId 
      });

      if (!itinerary) {
        return res.status(404).json({ 
          message: 'Itinerary not found or unauthorized' 
        });
      }

      // Remove from user's itineraries
      await User.findByIdAndUpdate(userId, { 
        $pull: { itineraries: itineraryId } 
      });

      res.json({ 
        message: 'Itinerary deleted successfully'
      });
    } catch (error) {
      console.error('Delete itinerary error:', error);
      res.status(500).json({ 
        message: 'Failed to delete itinerary',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = ItineraryController;
