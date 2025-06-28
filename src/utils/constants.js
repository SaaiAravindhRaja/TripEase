// File: src/utils/constants.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api',
  TIMEOUT: 10000, // 10 seconds
};

// Application Routes
export const ROUTES = {
  DASHBOARD: 'dashboard',
  FLIGHTS: 'flights',
  HOTELS: 'hotels',
  ATTRACTIONS: 'attractions',
  MAP: 'map',
  ITINERARY: 'itinerary',
};

// User Preferences
export const USER_INTERESTS = [
  'Culture',
  'Food', 
  'Nature',
  'Adventure',
  'Shopping',
  'Nightlife',
  'Art',
  'History',
  'Sports',
  'Music'
];

export const BUDGET_RANGES = [
  { value: 'low', label: 'Budget-friendly' },
  { value: 'medium', label: 'Moderate' },
  { value: 'high', label: 'Luxury' }
];

export const TRAVEL_PACE = [
  { value: 'relaxed', label: 'Relaxed' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'fast', label: 'Fast-paced' }
];

// Flight Classes
export const FLIGHT_CLASSES = [
  { value: 'ECONOMY', label: 'Economy' },
  { value: 'PREMIUM_ECONOMY', label: 'Premium Economy' },
  { value: 'BUSINESS', label: 'Business' },
  { value: 'FIRST', label: 'First Class' }
];

// Attraction Types
export const ATTRACTION_TYPES = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'LANDMARK', label: 'Landmark' },
  { value: 'MUSEUM', label: 'Museum' },
  { value: 'PARK', label: 'Park' },
  { value: 'CAFE', label: 'Café' },
  { value: 'SHOPPING', label: 'Shopping' },
  { value: 'ENTERTAINMENT', label: 'Entertainment' },
  { value: 'CULTURAL', label: 'Cultural' },
  { value: 'RELIGIOUS', label: 'Religious' },
  { value: 'HISTORICAL', label: 'Historical' }
];

// Trip Status
export const TRIP_STATUS = [
  { value: 'PLANNED', label: 'Planned', color: 'bg-blue-100 text-blue-800' },
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-100 text-green-800' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-gray-100 text-gray-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

// Booking Status
export const BOOKING_STATUS = [
  { value: 'PENDING', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-gray-100 text-gray-800' }
];

// Itinerary Status
export const ITINERARY_STATUS = [
  { value: 'DRAFT', label: 'Draft', color: 'bg-gray-100 text-gray-800' },
  { value: 'GENERATED', label: 'Generated', color: 'bg-blue-100 text-blue-800' },
  { value: 'APPROVED', label: 'Approved', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' }
];

// Colors for UI Components
export const COLORS = {
  PRIMARY: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8'
  },
  SUCCESS: {
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    800: '#166534'
  },
  WARNING: {
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    800: '#92400e'
  },
  ERROR: {
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    800: '#991b1b'
  }
};

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_TRIP_DURATION: 30,
  MIN_TRIP_DURATION: 1
};

// Default Values
export const DEFAULTS = {
  PASSENGERS: 1,
  HOTEL_GUESTS: 2,
  HOTEL_ROOMS: 1,
  SEARCH_RADIUS: 10, // km
  ITINERARY_DURATION: 3, // days
  MAP_CENTER: {
    lat: 48.8566,
    lng: 2.3522 // Paris coordinates as default
  }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  USER: 'tripease_user',
  PREFERENCES: 'tripease_preferences',
  RECENT_SEARCHES: 'tripease_recent_searches',
  CURRENT_TRIP: 'tripease_current_trip'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  API: 'yyyy-MM-dd',
  DATETIME: 'yyyy-MM-dd HH:mm:ss'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NOT_FOUND: 'The requested resource was not found.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FLIGHT_SEARCH_ERROR: 'Failed to search flights. Please try again.',
  HOTEL_SEARCH_ERROR: 'Failed to search hotels. Please try again.',
  ITINERARY_GENERATION_ERROR: 'Failed to generate itinerary. Please try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  USER_CREATED: 'User account created successfully!',
  TRIP_CREATED: 'Trip created successfully!',
  FLIGHT_BOOKED: 'Flight booked successfully!',
  HOTEL_BOOKED: 'Hotel booked successfully!',
  ITINERARY_GENERATED: 'Itinerary generated successfully!',
  ITINERARY_APPROVED: 'Itinerary approved successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!'
};

// Feature Flags (for development)
export const FEATURES = {
  ENABLE_PAYMENTS: process.env.REACT_APP_ENABLE_PAYMENTS === 'true',
  ENABLE_MAPS: process.env.REACT_APP_ENABLE_MAPS === 'true',
  ENABLE_NOTIFICATIONS: process.env.REACT_APP_ENABLE_NOTIFICATIONS === 'true',
  DEBUG_MODE: process.env.NODE_ENV === 'development'
};

export default {
  API_CONFIG,
  ROUTES,
  USER_INTERESTS,
  BUDGET_RANGES,
  TRAVEL_PACE,
  FLIGHT_CLASSES,
  ATTRACTION_TYPES,
  TRIP_STATUS,
  BOOKING_STATUS,
  ITINERARY_STATUS,
  COLORS,
  VALIDATION,
  DEFAULTS,
  STORAGE_KEYS,
  DATE_FORMATS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  FEATURES
};