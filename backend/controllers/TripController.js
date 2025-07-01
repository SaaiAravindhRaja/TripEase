const Trip = require('../models/Trip');
const FlightBooking = require('../models/FlightBooking');
const HotelBooking = require('../models/HotelBooking');
const Itinerary = require('../models/Itinerary');
const User = require('../models/User');

class TripController {
  static async createTrip(req, res) {
    try {
      const { 
        name, 
        destination, 
        startDate, 
        endDate, 
        flightBookingId, 
        hotelBookingId, 
        itineraryId,
        budget,
        notes
      } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!name || !destination || !startDate || !endDate) {
        return res.status(400).json({ 
          message: 'Name, destination, start date, and end date are required' 
        });
      }

      // Create new trip
      const newTrip = new Trip({
        userId,
        name: name.trim(),
        destination: destination.toUpperCase(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        flightBooking: flightBookingId || null,
        hotelBooking: hotelBookingId || null,
        itinerary: itineraryId || null,
        budget: budget || null,
        notes: notes || '',
        status: 'planning'
      });

      await newTrip.save();

      // Update user's trips
      await User.findByIdAndUpdate(userId, { 
        $push: { trips: newTrip._id } 
      });

      res.status(201).json({ 
        message: 'Trip created successfully!',
        trip: newTrip
      });
    } catch (error) {
      console.error('Create trip error:', error);
      res.status(500).json({ 
        message: 'Failed to create trip',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async finalizeTrip(req, res) {
    try {
      const { 
        destination, 
        departureDate, 
        returnDate, 
        finalItinerary, 
        flightBookingId, 
        hotelBookingId,
        tripName
      } = req.body;
      const userId = req.user.id;

      // Validate required fields
      if (!destination || !departureDate || !returnDate || !finalItinerary) {
        return res.status(400).json({ 
          message: 'Missing required trip details for finalization' 
        });
      }

      // Save the final itinerary
      const newItinerary = new Itinerary({
        userId,
        destination: destination.toUpperCase(),
        startDate: new Date(departureDate),
        endDate: new Date(returnDate),
        days: finalItinerary,
        title: `${tripName || destination} Itinerary`
      });
      await newItinerary.save();

      // Update user's itineraries
      await User.findByIdAndUpdate(userId, { 
        $push: { itineraries: newItinerary._id } 
      });

      // Create the Trip document linking everything
      const newTrip = new Trip({
        userId,
        name: tripName || `Trip to ${destination} (${new Date(departureDate).toLocaleDateString()})`,
        destination: destination.toUpperCase(),
        startDate: new Date(departureDate),
        endDate: new Date(returnDate),
        flightBooking: flightBookingId || null,
        hotelBooking: hotelBookingId || null,
        itinerary: newItinerary._id,
        status: 'confirmed'
      });
      await newTrip.save();

      // Update user's trips
      await User.findByIdAndUpdate(userId, { 
        $push: { trips: newTrip._id } 
      });

      res.status(201).json({
        message: 'Trip finalized and saved!',
        trip: newTrip,
        itinerary: newItinerary
      });
    } catch (error) {
      console.error('Finalize trip error:', error);
      res.status(500).json({ 
        message: 'Failed to finalize trip',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getTrips(req, res) {
    try {
      const userId = req.user.id;
      const { status, limit = 10, page = 1 } = req.query;

      const query = { userId };
      if (status) {
        query.status = status;
      }

      const trips = await Trip.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip((parseInt(page) - 1) * parseInt(limit))
        .select('name destination startDate endDate status budget');

      const totalTrips = await Trip.countDocuments(query);

      res.json({ 
        trips,
        count: trips.length,
        total: totalTrips,
        page: parseInt(page),
        totalPages: Math.ceil(totalTrips / parseInt(limit))
      });
    } catch (error) {
      console.error('Get trips error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch trips',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getTrip(req, res) {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      const trip = await Trip.findOne({ _id: tripId, userId })
        .populate('flightBooking')
        .populate('hotelBooking')
        .populate('itinerary');

      if (!trip) {
        return res.status(404).json({ 
          message: 'Trip not found or unauthorized' 
        });
      }

      res.json({ trip });
    } catch (error) {
      console.error('Get trip error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch trip details',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async updateTrip(req, res) {
    try {
      const { tripId } = req.params;
      const updates = req.body;
      const userId = req.user.id;

      // Remove sensitive fields that shouldn't be updated directly
      delete updates.userId;
      delete updates._id;

      const trip = await Trip.findOneAndUpdate(
        { _id: tripId, userId },
        updates,
        { new: true, runValidators: true }
      );

      if (!trip) {
        return res.status(404).json({ 
          message: 'Trip not found or unauthorized' 
        });
      }

      res.json({ 
        message: 'Trip updated successfully',
        trip 
      });
    } catch (error) {
      console.error('Update trip error:', error);
      res.status(500).json({ 
        message: 'Failed to update trip',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async deleteTrip(req, res) {
    try {
      const { tripId } = req.params;
      const userId = req.user.id;

      // Find the trip to ensure it belongs to the user
      const tripToDelete = await Trip.findOne({ _id: tripId, userId });

      if (!tripToDelete) {
        return res.status(404).json({ 
          message: 'Trip not found or unauthorized' 
        });
      }

      // Delete associated data
      const deletePromises = [];

      if (tripToDelete.flightBooking) {
        deletePromises.push(
          FlightBooking.findByIdAndDelete(tripToDelete.flightBooking),
          User.findByIdAndUpdate(userId, { 
            $pull: { flightBookings: tripToDelete.flightBooking } 
          })
        );
      }

      if (tripToDelete.hotelBooking) {
        deletePromises.push(
          HotelBooking.findByIdAndDelete(tripToDelete.hotelBooking),
          User.findByIdAndUpdate(userId, { 
            $pull: { hotelBookings: tripToDelete.hotelBooking } 
          })
        );
      }

      if (tripToDelete.itinerary) {
        deletePromises.push(
          Itinerary.findByIdAndDelete(tripToDelete.itinerary),
          User.findByIdAndUpdate(userId, { 
            $pull: { itineraries: tripToDelete.itinerary } 
          })
        );
      }

      // Execute all deletions
      await Promise.all(deletePromises);

      // Delete the trip itself
      await Trip.findByIdAndDelete(tripId);
      await User.findByIdAndUpdate(userId, { 
        $pull: { trips: tripId } 
      });

      res.json({ 
        message: 'Trip and all associated data deleted successfully' 
      });
    } catch (error) {
      console.error('Delete trip error:', error);
      res.status(500).json({ 
        message: 'Failed to delete trip',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = TripController;
