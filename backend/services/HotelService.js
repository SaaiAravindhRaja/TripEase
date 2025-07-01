// Mock data for hotel search and booking
class HotelService {
  // City name to code mapping (same as FlightService)
  static cityToCodeMap = {
    'new york': 'NYC',
    'nyc': 'NYC',
    'new york city': 'NYC',
    'manhattan': 'NYC',
    'los angeles': 'LAX',
    'la': 'LAX',
    'lax': 'LAX',
    'hollywood': 'LAX',
    'san francisco': 'SFO',
    'sf': 'SFO',
    'sfo': 'SFO',
    'bay area': 'SFO',
    'miami': 'MIA',
    'mia': 'MIA',
    'south beach': 'MIA',
    'paris': 'PAR',
    'par': 'PAR',
    'france': 'PAR'
  };

  // Code to city name mapping
  static codeToNameMap = {
    'NYC': 'New York',
    'LAX': 'Los Angeles', 
    'SFO': 'San Francisco',
    'MIA': 'Miami',
    'PAR': 'Paris'
  };

  static fakeHotels = [
    {
      id: 'h1',
      name: 'Grand Los Angeles Hotel',
      destination: 'LAX',
      rating: 4,
      pricePerNight: 150,
      address: '123 Hollywood Blvd',
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa'],
      images: ['hotel1.jpg', 'hotel1_room.jpg'],
      description: 'Luxury hotel in the heart of Hollywood'
    },
    {
      id: 'h2',
      name: 'Downtown LA Inn',
      destination: 'LAX',
      rating: 3,
      pricePerNight: 100,
      address: '456 City Center',
      amenities: ['WiFi', 'Parking', 'Business Center'],
      images: ['hotel2.jpg'],
      description: 'Affordable accommodation in downtown LA'
    },
    {
      id: 'h3',
      name: 'San Francisco Bay View',
      destination: 'SFX',
      rating: 5,
      pricePerNight: 250,
      address: '789 Pier St',
      amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant', 'Spa', 'Ocean View'],
      images: ['hotel3.jpg', 'hotel3_view.jpg'],
      description: 'Premium hotel with stunning bay views'
    },
    {
      id: 'h4',
      name: 'Miami Beach Resort',
      destination: 'MIA',
      rating: 4,
      pricePerNight: 200,
      address: '101 Ocean Drive',
      amenities: ['WiFi', 'Pool', 'Beach Access', 'Restaurant', 'Bar'],
      images: ['hotel4.jpg'],
      description: 'Beachfront resort in vibrant South Beach'
    },
    {
      id: 'h5',
      name: 'Parisian Charm Hotel',
      destination: 'PAR',
      rating: 4,
      pricePerNight: 300,
      address: 'Arc de Triomphe Area',
      amenities: ['WiFi', 'Restaurant', 'Concierge', 'Room Service'],
      images: ['hotel5.jpg'],
      description: 'Elegant hotel near the Arc de Triomphe'
    }
  ];

  static convertCityToCode(cityInput) {
    const normalizedInput = cityInput.toLowerCase().trim();
    return this.cityToCodeMap[normalizedInput] || cityInput.toUpperCase();
  }

  static getCityNameFromCode(code) {
    return this.codeToNameMap[code] || code;
  }

  static searchHotels(destination, checkInDate = null, checkOutDate = null, guests = 1) {
    // Convert city name to code
    const destinationCode = this.convertCityToCode(destination);
    
    const foundHotels = this.fakeHotels.filter(hotel =>
      hotel.destination === destinationCode
    );

    // Add calculated total price if dates are provided
    if (checkInDate && checkOutDate) {
      const nights = this.calculateNights(checkInDate, checkOutDate);
      foundHotels.forEach(hotel => {
        hotel.totalPrice = hotel.pricePerNight * nights;
        hotel.nights = nights;
        hotel.destinationCity = this.getCityNameFromCode(hotel.destination);
      });
    } else {
      foundHotels.forEach(hotel => {
        hotel.destinationCity = this.getCityNameFromCode(hotel.destination);
      });
    }

    return {
      hotels: foundHotels,
      count: foundHotels.length,
      searchCriteria: {
        destination,
        checkInDate,
        checkOutDate,
        guests
      }
    };
  }

  static getHotelById(hotelId) {
    return this.fakeHotels.find(hotel => hotel.id === hotelId);
  }

  static calculateNights(checkInDate, checkOutDate) {
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  }

  static calculateTotalPrice(hotelId, checkInDate, checkOutDate, guests = 1) {
    const hotel = this.getHotelById(hotelId);
    if (!hotel) return null;

    const nights = this.calculateNights(checkInDate, checkOutDate);
    const basePrice = hotel.pricePerNight * nights;
    const taxes = Math.round(basePrice * 0.12); // 12% tax simulation
    const fees = 25; // Booking fee simulation

    return {
      pricePerNight: hotel.pricePerNight,
      nights,
      guests,
      basePrice,
      taxes,
      fees,
      totalPrice: basePrice + taxes + fees
    };
  }

  static getHotelsByRating(minRating = 3) {
    return this.fakeHotels.filter(hotel => hotel.rating >= minRating);
  }

  static getHotelsByPriceRange(minPrice = 0, maxPrice = Infinity) {
    return this.fakeHotels.filter(hotel =>
      hotel.pricePerNight >= minPrice && hotel.pricePerNight <= maxPrice
    );
  }

  static getPopularDestinations() {
    const destinations = {};
    this.fakeHotels.forEach(hotel => {
      destinations[hotel.destination] = (destinations[hotel.destination] || 0) + 1;
    });

    return Object.entries(destinations)
      .sort(([,a], [,b]) => b - a)
      .map(([destination, hotelCount]) => ({ destination, hotelCount }));
  }
}

module.exports = HotelService;
