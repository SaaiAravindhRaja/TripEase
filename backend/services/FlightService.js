// Mock data for flight search and booking
class FlightService {
  // City name to airport code mapping
  static cityToAirportMap = {
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

  // Airport code to city name mapping
  static airportToCityMap = {
    'NYC': 'New York',
    'LAX': 'Los Angeles', 
    'SFO': 'San Francisco',
    'MIA': 'Miami',
    'PAR': 'Paris'
  };

  static fakeFlights = [
    {
      id: 'f1',
      origin: 'NYC',
      destination: 'LAX',
      airline: 'AirDemo',
      price: 250,
      departureTime: '08:00',
      arrivalTime: '11:00',
      departureDate: '2025-08-01',
      returnDate: '2025-08-05',
      duration: '6h 0m',
      stops: 0,
      flightNumber: 'AD123'
    },
    {
      id: 'f2',
      origin: 'NYC',
      destination: 'LAX',
      airline: 'FlySim',
      price: 300,
      departureTime: '10:00',
      arrivalTime: '13:00',
      departureDate: '2025-08-01',
      returnDate: '2025-08-05',
      duration: '6h 0m',
      stops: 0,
      flightNumber: 'FS456'
    },
    {
      id: 'f3',
      origin: 'LAX',
      destination: 'SFO',
      airline: 'AirDemo',
      price: 100,
      departureTime: '09:00',
      arrivalTime: '10:30',
      departureDate: '2025-09-10',
      returnDate: '2025-09-15',
      duration: '1h 30m',
      stops: 0,
      flightNumber: 'AD789'
    },
    {
      id: 'f4',
      origin: 'NYC',
      destination: 'MIA',
      airline: 'FlySim',
      price: 180,
      departureTime: '07:00',
      arrivalTime: '10:00',
      departureDate: '2025-07-01',
      returnDate: '2025-07-08',
      duration: '3h 0m',
      stops: 0,
      flightNumber: 'FS321'
    },
    {
      id: 'f5',
      origin: 'NYC',
      destination: 'PAR',
      airline: 'GlobalAir',
      price: 700,
      departureTime: '18:00',
      arrivalTime: '08:00',
      departureDate: '2025-11-01',
      returnDate: '2025-11-07',
      duration: '8h 0m',
      stops: 0,
      flightNumber: 'GA901'
    },
    {
      id: 'f6',
      origin: 'NYC',
      destination: 'MIA',
      airline: 'AirDemo',
      price: 200,
      departureTime: '14:00',
      arrivalTime: '17:00',
      departureDate: '2025-07-15',
      returnDate: '2025-07-22',
      duration: '3h 0m',
      stops: 0,
      flightNumber: 'AD555'
    },
    {
      id: 'f7',
      origin: 'NYC',
      destination: 'MIA',
      airline: 'SkyLine',
      price: 165,
      departureTime: '09:30',
      arrivalTime: '12:30',
      departureDate: '2025-08-01',
      returnDate: '2025-08-08',
      duration: '3h 0m',
      stops: 0,
      flightNumber: 'SL789'
    }
  ];

  static convertCityToAirportCode(cityInput) {
    const normalizedInput = cityInput.toLowerCase().trim();
    return this.cityToAirportMap[normalizedInput] || cityInput.toUpperCase();
  }

  static getCityNameFromCode(airportCode) {
    return this.airportToCityMap[airportCode] || airportCode;
  }

  static searchFlights(origin, destination, departureDate, returnDate = null) {
    // Convert city names to airport codes
    const originCode = this.convertCityToAirportCode(origin);
    const destinationCode = this.convertCityToAirportCode(destination);

    console.log('🔍 Flight search:', { originCode, destinationCode, departureDate, returnDate });

    // First try exact date match
    let foundFlights = this.fakeFlights.filter(flight =>
      flight.origin === originCode &&
      flight.destination === destinationCode &&
      flight.departureDate === departureDate &&
      (returnDate ? flight.returnDate === returnDate : true)
    );

    // If no exact match, find flights for the same route regardless of dates
    if (foundFlights.length === 0) {
      console.log('🔍 No exact date match, searching by route only...');
      foundFlights = this.fakeFlights.filter(flight =>
        flight.origin === originCode &&
        flight.destination === destinationCode
      );
      
      // Update the found flights with the requested dates
      foundFlights = foundFlights.map(flight => ({
        ...flight,
        departureDate: departureDate,
        returnDate: returnDate || flight.returnDate
      }));
    }

    console.log('🔍 Found flights:', foundFlights);

    // Add city names to flight results for better display
    const flightsWithCityNames = foundFlights.map(flight => ({
      ...flight,
      originCity: this.getCityNameFromCode(flight.origin),
      destinationCity: this.getCityNameFromCode(flight.destination)
    }));

    return {
      flights: flightsWithCityNames,
      count: flightsWithCityNames.length,
      searchCriteria: {
        origin,
        destination,
        departureDate,
        returnDate
      }
    };
  }

  static getFlightById(flightId) {
    return this.fakeFlights.find(flight => flight.id === flightId);
  }

  static calculateTotalPrice(flightId, passengers = 1) {
    const flight = this.getFlightById(flightId);
    if (!flight) return null;
    
    return {
      basePrice: flight.price,
      passengers,
      totalPrice: flight.price * passengers,
      taxes: Math.round(flight.price * 0.15), // 15% tax simulation
      finalPrice: Math.round(flight.price * passengers * 1.15)
    };
  }

  static getPopularDestinations() {
    const destinations = {};
    this.fakeFlights.forEach(flight => {
      destinations[flight.destination] = (destinations[flight.destination] || 0) + 1;
    });

    return Object.entries(destinations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([destination, count]) => ({ destination, flightCount: count }));
  }
}

module.exports = FlightService;
