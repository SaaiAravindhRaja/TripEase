const HotelService = require('../services/HotelService');
const HotelBooking = require('../models/HotelBooking');
const User = require('../models/User');

// Mock data store for development
let mockHotelBookings = [];
let mockHotelBookingId = 1;

class HotelController {
  static async searchHotels(req, res) {
    try {
      const { destination, checkInDate, checkOutDate, guests = 1 } = req.body;

      const searchResult = HotelService.searchHotels(
        destination, 
        checkInDate, 
        checkOutDate, 
        guests
      );

      if (searchResult.count === 0) {
        return res.status(404).json({ 
          message: `No hotels found in ${destination}`,
          suggestion: 'Try searching for LAX, SFX, MIA, or PAR for demo data'
        });
      }

      res.json({
        message: `Found ${searchResult.count} hotel(s) in ${destination}`,
        ...searchResult
      });
    } catch (error) {
      console.error('Hotel search error:', error);
      res.status(500).json({ 
        message: 'Error searching hotels',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async bookHotel(req, res) {
    try {
      const { hotelId, checkInDate, checkOutDate, guests = 1 } = req.body;
      const userId = req.user.id;

      // Validate dates
      if (!checkInDate || !checkOutDate) {
        return res.status(400).json({ 
          message: 'Check-in and check-out dates are required' 
        });
      }

      // Additional date validation
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (checkIn < today) {
        return res.status(400).json({ 
          message: 'Check-in date cannot be in the past' 
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({ 
          message: 'Check-out date must be after check-in date' 
        });
      }

      // Get hotel details
      const hotel = HotelService.getHotelById(hotelId);
      if (!hotel) {
        return res.status(404).json({ message: 'Hotel not found' });
      }

      // Calculate pricing
      const pricing = HotelService.calculateTotalPrice(
        hotelId, 
        checkInDate, 
        checkOutDate, 
        guests
      );

      // Mock mode for development
      if (process.env.NODE_ENV === 'development_mock') {
        // Create mock booking record
        const newBooking = {
          _id: mockHotelBookingId++,
          userId,
          hotelId,
          hotelName: hotel.name,
          destination: hotel.destination,
          checkInDate,
          checkOutDate,
          pricePerNight: hotel.pricePerNight,
          guests,
          status: 'confirmed',
          bookingDate: new Date()
        };
        
        mockHotelBookings.push(newBooking);

        return res.status(201).json({ 
          message: `Hotel ${hotel.name} booked successfully!`,
          hotelBookingId: newBooking._id,
          booking: {
            id: newBooking._id,
            hotel: hotel,
            pricing: pricing,
            status: newBooking.status,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            guests,
            bookingDate: newBooking.bookingDate
          }
        });
      }

      // Regular MongoDB mode
      // Create booking record
      const newBooking = new HotelBooking({
        userId,
        hotelName: hotel.name,
        destination: hotel.destination,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        pricePerNight: hotel.pricePerNight,
        guests,
        status: 'confirmed'
      });
      
      await newBooking.save();

      // Update user's hotel bookings
      await User.findByIdAndUpdate(userId, { 
        $push: { hotelBookings: newBooking._id } 
      });

      res.status(201).json({ 
        message: `Hotel ${hotel.name} booked successfully!`,
        hotelBookingId: newBooking._id,
        booking: {
          id: newBooking._id,
          hotel: hotel,
          pricing: pricing,
          status: newBooking.status,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guests
        }
      });
    } catch (error) {
      console.error('Hotel booking error:', error);
      res.status(500).json({ 
        message: 'Failed to book hotel',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getBookings(req, res) {
    try {
      const userId = req.user.id;
      const bookings = await HotelBooking.find({ userId })
        .sort({ bookingDate: -1 });

      res.json({ 
        bookings,
        count: bookings.length
      });
    } catch (error) {
      console.error('Get hotel bookings error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch hotel bookings',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async cancelBooking(req, res) {
    try {
      const { bookingId } = req.params;
      const userId = req.user.id;

      const booking = await HotelBooking.findOneAndUpdate(
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
        message: 'Hotel booking cancelled successfully',
        booking 
      });
    } catch (error) {
      console.error('Cancel hotel booking error:', error);
      res.status(500).json({ 
        message: 'Failed to cancel hotel booking',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static getPopularDestinations(req, res) {
    try {
      const destinations = HotelService.getPopularDestinations();
      res.json({ destinations });
    } catch (error) {
      console.error('Get popular destinations error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch popular destinations',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static getHotelsByRating(req, res) {
    try {
      const { minRating = 3 } = req.query;
      const hotels = HotelService.getHotelsByRating(parseInt(minRating));
      res.json({ hotels, count: hotels.length });
    } catch (error) {
      console.error('Get hotels by rating error:', error);
      res.status(500).json({ 
        message: 'Failed to fetch hotels by rating',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = HotelController;
