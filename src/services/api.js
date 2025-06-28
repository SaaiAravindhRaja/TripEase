// File: src/services/api.js

const API_BASE_URL = 'http://localhost:8080/api';

// API utility function
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// User API functions
export const userAPI = {
  // Create a new user
  createUser: (userData) => 
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  // Get user by ID
  getUserById: (userId) => 
    apiCall(`/users/${userId}`),

  // Update user
  updateUser: (userId, userData) => 
    apiCall(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  // Delete user
  deleteUser: (userId) => 
    apiCall(`/users/${userId}`, {
      method: 'DELETE',
    }),

  // Get all users
  getAllUsers: () => 
    apiCall('/users'),
};

// Trip API functions
export const tripAPI = {
  // Create a new trip
  createTrip: (userId, tripData) => 
    apiCall(`/trips?userId=${userId}`, {
      method: 'POST',
      body: JSON.stringify(tripData),
    }),

  // Get trips by user ID
  getTripsByUserId: (userId) => 
    apiCall(`/trips/user/${userId}`),

  // Get trip by ID
  getTripById: (tripId) => 
    apiCall(`/trips/${tripId}`),

  // Update trip
  updateTrip: (tripId, tripData) => 
    apiCall(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    }),

  // Delete trip
  deleteTrip: (tripId) => 
    apiCall(`/trips/${tripId}`, {
      method: 'DELETE',
    }),
};

// Flight API functions
export const flightAPI = {
  // Search flights
  searchFlights: (searchRequest) => 
    apiCall('/flights/search', {
      method: 'POST',
      body: JSON.stringify(searchRequest),
    }),

  // Get all flights
  getAllFlights: () => 
    apiCall('/flights'),

  // Get flight by ID
  getFlightById: (flightId) => 
    apiCall(`/flights/${flightId}`),
};

// Hotel API functions
export const hotelAPI = {
  // Search hotels
  searchHotels: (searchRequest) => 
    apiCall('/hotels/search', {
      method: 'POST',
      body: JSON.stringify(searchRequest),
    }),

  // Get all hotels
  getAllHotels: () => 
    apiCall('/hotels'),

  // Get hotel by ID
  getHotelById: (hotelId) => 
    apiCall(`/hotels/${hotelId}`),

  // Get hotels by city
  getHotelsByCity: (city) => 
    apiCall(`/hotels/city/${city}`),
};

// Attraction API functions
export const attractionAPI = {
  // Get attractions by location
  getAttractionsByLocation: (location) => 
    apiCall(`/attractions/location/${location}`),

  // Get attractions by type
  getAttractionsByType: (type) => 
    apiCall(`/attractions/type/${type}`),

  // Get nearby attractions
  getNearbyAttractions: (latitude, longitude, radius = 10) => 
    apiCall(`/attractions/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),

  // Get all attractions
  getAllAttractions: () => 
    apiCall('/attractions'),

  // Get attraction by ID
  getAttractionById: (attractionId) => 
    apiCall(`/attractions/${attractionId}`),
};

// Itinerary API functions
export const itineraryAPI = {
  // Generate AI itinerary
  generateItinerary: (generationRequest) => 
    apiCall('/itineraries/generate', {
      method: 'POST',
      body: JSON.stringify(generationRequest),
    }),

  // Get itineraries by trip ID
  getItinerariesByTripId: (tripId) => 
    apiCall(`/itineraries/trip/${tripId}`),

  // Get itinerary by ID
  getItineraryById: (itineraryId) => 
    apiCall(`/itineraries/${itineraryId}`),

  // Approve itinerary
  approveItinerary: (itineraryId) => 
    apiCall(`/itineraries/${itineraryId}/approve`, {
      method: 'PUT',
    }),

  // Cancel itinerary
  cancelItinerary: (itineraryId) => 
    apiCall(`/itineraries/${itineraryId}`, {
      method: 'DELETE',
    }),
};

// Example usage functions for components
export const apiHelpers = {
  // Login simulation (replace with actual auth)
  login: async (email, password) => {
    try {
      // This would be replaced with actual authentication
      const user = await userAPI.getUserByEmail?.(email);
      return { success: true, user: user.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Search and book flights
  searchAndBookFlights: async (searchCriteria) => {
    try {
      const response = await flightAPI.searchFlights(searchCriteria);
      return response.data;
    } catch (error) {
      console.error('Flight search failed:', error);
      return [];
    }
  },

  // Search hotels with filters
  searchHotelsWithFilters: async (destination, checkIn, checkOut, guests = 2, rooms = 1) => {
    try {
      const searchRequest = {
        destination,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
        rooms
      };
      const response = await hotelAPI.searchHotels(searchRequest);
      return response.data;
    } catch (error) {
      console.error('Hotel search failed:', error);
      return [];
    }
  },

  // Get attractions for a destination
  getDestinationAttractions: async (destination) => {
    try {
      const response = await attractionAPI.getAttractionsByLocation(destination);
      return response.data;
    } catch (error) {
      console.error('Attraction search failed:', error);
      return [];
    }
  },

  // Generate AI itinerary
  createAIItinerary: async (tripId, preferences) => {
    try {
      const generationRequest = {
        tripId,
        interests: preferences.interests,
        budget: preferences.budget,
        pace: preferences.pace,
        duration: preferences.duration
      };
      const response = await itineraryAPI.generateItinerary(generationRequest);
      return response.data;
    } catch (error) {
      console.error('Itinerary generation failed:', error);
      throw error;
    }
  }
};

export default {
  userAPI,
  tripAPI,
  flightAPI,
  hotelAPI,
  attractionAPI,
  itineraryAPI,
  apiHelpers
};