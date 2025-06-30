const FlightService = require('../services/FlightService');
const FlightBooking = require('../models/FlightBooking');
const User = require('../models/User');

// Mock data store for development
let mockBookings = [];
let mockBookingId = 1;

class FlightController {
  static async searchFlights(req, res) {
    try {
      const { origin, destination, departureDate, returnDate } = req.body;

      // Date validation
      if (!origin || !destination || !departureDate) {
        return res.status(400).json({ 
          message: 'Origin, destination, and departure date are required' 
        });
      }

      const departure = new Date(departureDate);
      const returnD = returnDate ? new Date(returnDate) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (departure < today) {
        return res.status(400).json({ 
          message: 'Departure date cannot be in the past' 
        });
      }

      if (returnD && returnD <= departure) {
        return res.status(400).json({ 
          message: 'Return date must be after departure date' 
        });
      }

      const searchResult = FlightService.searchFlights(
        origin, 
        destination, 
        departureDate, 
        returnDate
      );

      if (searchResult.count === 0) {
        return res.status(404).json({ 
          message: `No flights found for ${origin} to ${destination} on ${departureDate}`,
          suggestion: 'Try NYC to LAX for 2025-08-01 for demo data'
        });
      }

      res.json({
        message: `Found ${searchResult.count} flight(s)`,
        ...searchResult
      });
    } catch (error) {
      console.error('Flight search error:', error);
      res.status(500).json({ 
        message: 'Error searching flights',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async bookFlight(req, res) {
    try {
      const { flightId, passengers = 1 } = req.body;
      const userId = req.user.id;

      // Get flight details
      const flight = FlightService.getFlightById(flightId);
      if (!flight) {
        return res.status(404).json({ message: 'Flight not found' });
      }

      // Calculate pricing
      const pricing = FlightService.calculateTotalPrice(flightId, passengers);

      // Mock mode for development
      if (process.env.NODE_ENV === 'development_mock') {
        // Create mock booking record
        const newBooking = {
          _id: mockBookingId++,
          userId,
          flightId,
          origin: flight.origin,
          destination: flight.destination,
          departureDate: flight.departureDate,
          returnDate: flight.returnDate || null,
          airline: flight.airline,
          flightNumber: flight.flightNumber,
          price: pricing.finalPrice,
          status: 'confirmed',
          bookingDate: new Date(),
          passengers
        };
        
        mockBookings.push(newBooking);

        return res.status(201).json({ 
          message: `Flight ${flight.airline} ${flight.flightNumber} booked successfully!`,
          flightBookingId: newBooking._id,
          booking: {
            id: newBooking._id,
            flight: flight,
            pricing: pricing,
            status: newBooking.status,
            bookingDate: newBooking.bookingDate
          }
        });
      }

      // Regular MongoDB mode
      // Create booking record
      const newBooking = new FlightBooking({
        userId,
        origin: flight.origin,
        destination: flight.destination,
        departureDate: new Date(flight.departureDate),
        returnDate: flight.returnDate ? new Date(flight.returnDate) : undefined,
        airline: flight.airline,
        price: pricing.finalPrice,
        status: 'confirmed'
      });
      
      await newBooking.save();

      // Update user's flight bookings
      await User.findByIdAndUpdate(userId, { 
        $push: { flightBookings: newBooking._id } 
      });

      res.status(201).json({ 
        message: `Flight ${flight.airline} to ${flight.destination} booked successfully!`,
        flightBookingId: newBooking._id,
        booking: {
          id: newBooking._id,
          flight: flight,
          pricing: pricing,
          status: newBooking.status
        }
      });
    } catch (error) {
      console.error('Flight booking error:', error);
      res.status(500).json({ 
        message: 'Failed to book flight',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getBookings(req, res) {
    try {
      const userId = req.user.id;

      // Mock mode for development
      if (process.env.NODE_ENV === 'development_mock') {
        const userBookings = mockBookings.filter(booking => booking.userId === userId);
        return res.json({ 
          bookings: userBookings,
          count: userBookings.length
        });
      }

      // Regular MongoDB mode
      const bookings = await FlightBooking.find({ userId })
        .sort({ bookingDate: -1 });

      res.json({ 
        bookings,
        count: bookings.length
      });
    } catch (error) {
      console.error('Get flight bookings error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch flight bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async cancelBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      // Mock mode for development
      if (process.env.NODE_ENV === 'development_mock') {
        const bookingIndex = mockBookings.findIndex(
          booking => booking._id == bookingId && booking.userId === userId
        );
        
        if (bookingIndex === -1) {
          return res.status(404).json({ 
            message: 'Booking not found or unauthorized' 
          });
        }

        mockBookings[bookingIndex].status = 'cancelled';
        
        return res.json({ 
          message: 'Flight booking cancelled successfully',
          booking: mockBookings[bookingIndex]
        });
      }

      // Regular MongoDB mode
      const booking = await FlightBooking.findOneAndUpdate(
        { _id: bookingId, userId },
        { status: 'cancelled' },
        { new: true }
      );

      if (!booking) {
        return res.status(404).json({ 
          message: 'Booking not found or unauthorized' 
        });
      }

      res.json({ 
        message: 'Flight booking cancelled successfully',
        booking 
      });
    } catch (error) {
      console.error('Cancel flight booking error:', error);
      res.status(500).json({ 
        message: 'Failed to cancel flight booking',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static getPopularDestinations(req, res) {
    try {
      const destinations = FlightService.getPopularDestinations();
      res.json({ destinations });
    } catch (error) {
      console.error('Get popular destinations error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch popular destinations',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = FlightController;
