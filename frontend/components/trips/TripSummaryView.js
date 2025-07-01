import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import Toast, { useToast } from '../ui/Toast';

// Debug helper function - add to global scope
if (typeof window !== 'undefined') {
  window.debugTrips = () => {
    console.log('🔍 DEBUG: All localStorage keys:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      console.log(`  - ${key}`);
    }
    
    console.log('🔍 DEBUG: Trip-related data:');
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('trip-') || key === 'savedTrip')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          console.log(`  ${key}:`, data);
        } catch (e) {
          console.log(`  ${key}: (failed to parse)`, localStorage.getItem(key));
        }
      }
    }
  };
  
  // Function to clear all trip data
  window.clearAllTrips = () => {
    console.log('🗑️ Clearing all trip data...');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('trip-') || key === 'savedTrip')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      console.log(`🗑️ Removed: ${key}`);
    });
    console.log('✅ All trip data cleared!');
  };
}

export default function TripSummaryView({ tripId }) {
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    const fetchTripDetails = async () => {
      console.log('📄 Loading trip with ID:', tripId);
      console.log('📄 Full URL:', typeof window !== 'undefined' ? window.location.href : 'server-side');
      
      try {
        let tripData = null;
        
        if (tripId) {
          // Clean tripId - remove 'trip-' prefix if it exists
          const cleanTripId = tripId.toString().replace(/^trip-/, '');
          
          // Try different key formats
          const possibleKeys = [
            `trip-${tripId}`,
            `trip-${cleanTripId}`,
            tripId,
            cleanTripId
          ];
          
          for (const key of possibleKeys) {
            console.log('📄 Trying key:', key);
            const savedTripData = localStorage.getItem(key);
            if (savedTripData) {
              console.log('📄 Found trip data with key:', key);
              tripData = JSON.parse(savedTripData);
              break;
            }
          }
        }
        
        // Fallback to the most recent saved trip
        if (!tripData) {
          console.log('📄 Trying fallback savedTrip...');
          const fallbackTripData = localStorage.getItem('savedTrip');
          if (fallbackTripData) {
            tripData = JSON.parse(fallbackTripData);
            console.log('📄 Found fallback trip data');
          }
        }
        
        // If no trip data found, don't create mock data
        if (!tripData) {
          console.log('📄 No trip data found - user needs to plan a trip first');
          console.log('📄 Available localStorage keys:', Object.keys(localStorage));
          
          // Try to find ANY trip-related data for debugging
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && (key.includes('trip') || key.includes('booking') || key.includes('flight') || key.includes('hotel'))) {
              console.log(`📄 Found related key: ${key} =`, localStorage.getItem(key));
            }
          }
        }
        
        if (tripData) {
          console.log('📄 Setting trip data:', tripData);
          console.log('📄 Trip data keys:', Object.keys(tripData));
          console.log('📄 Trip destination:', tripData.destination);
          console.log('📄 Trip dates:', tripData.departureDate, '-', tripData.returnDate);
          console.log('📄 Trip hotel:', tripData.hotelName);
          console.log('📄 Trip itinerary:', tripData.itinerary);
          
          // Validate that this is actual trip data, not mock data
          if (tripData.destination === 'Los Angeles' && tripData.flightBookingId === 'test-flight-123') {
            console.log('⚠️ Found old mock data, clearing it...');
            localStorage.removeItem('savedTrip');
            if (tripId) {
              localStorage.removeItem(`trip-${tripId}`);
            }
            setTrip(null);
            showToast('Please plan a new trip - old test data has been cleared', 'info');
          } else {
            setTrip(tripData);
            showToast('Trip summary loaded successfully', 'success');
          }
        } else {
          console.log('📄 No trip data found');
          console.log('📄 Available localStorage keys:', Object.keys(localStorage));
          setTrip(null);
          showToast('No trip data found. Please plan a trip first.', 'error');
        }
      } catch (err) {
        console.error('Error loading trip details:', err);
        showToast('Error loading trip summary', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, showToast]);

  const handleDeleteTrip = () => {
    if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) {
      return;
    }
    
    setDeleteLoading(true);
    
    try {
      // Remove from localStorage
      if (tripId) {
        localStorage.removeItem(`trip-${tripId}`);
      }
      localStorage.removeItem('savedTrip');
      
      showToast('Trip deleted successfully', 'success');
      
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (error) {
      console.error('Error deleting trip:', error);
      showToast('Error deleting trip', 'error');
      setDeleteLoading(false);
    }
  };

  const handlePlanAnotherTrip = () => {
    // Navigate to start planning a new trip without deleting current trip
    window.location.href = '/flights';
  };

  const handleReturnHome = () => {
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTripDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Debug function to check localStorage
  const debugLocalStorage = () => {
    console.log('🔍 LocalStorage Debug:');
    console.log('🔍 savedTrip:', localStorage.getItem('savedTrip'));
    
    // Check all trip keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('trip-')) {
        console.log(`🔍 ${key}:`, localStorage.getItem(key));
      }
    }
  };

  // Call debug function periodically
  if (typeof window !== 'undefined') {
    window.debugTrips = debugLocalStorage;
  }

  if (loading) {
    return <Loading message="Loading your trip details..." />;
  }

  if (!trip) {
    return (
      <div className="trip-summary-error">
        <Card className="error-card">
          <h2>Trip Not Found</h2>
          <p>Sorry, we couldn't find the trip you're looking for.</p>
          <Button onClick={() => router.push('/')}>
            Return to Home
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="trip-summary">
      <ToastContainer />
      
      <div className="summary-header">
        <h1>Trip Summary</h1>
        <div className="trip-meta">
          <span className="destination">{trip.destination}</span>
          <span className="duration">
            {calculateTripDuration(trip.departureDate, trip.returnDate)} days
          </span>
        </div>
      </div>

      <div className="summary-content">
        <Card className="trip-details">
          <h2>Trip Details</h2>
          <div className="detail-grid">
            <div className="detail-item">
              <strong>Destination:</strong>
              <span>{trip.destination}</span>
            </div>
            <div className="detail-item">
              <strong>Departure:</strong>
              <span>{formatDate(trip.departureDate)}</span>
            </div>
            <div className="detail-item">
              <strong>Return:</strong>
              <span>{formatDate(trip.returnDate)}</span>
            </div>
            <div className="detail-item">
              <strong>Duration:</strong>
              <span>{calculateTripDuration(trip.departureDate, trip.returnDate)} days</span>
            </div>
            {trip.hotelName && (
              <div className="detail-item">
                <strong>Hotel:</strong>
                <span>{trip.hotelName}</span>
              </div>
            )}
            {trip.flightBookingId && (
              <div className="detail-item">
                <strong>Flight Booking ID:</strong>
                <span>{trip.flightBookingId}</span>
              </div>
            )}
            {trip.hotelBookingId && (
              <div className="detail-item">
                <strong>Hotel Booking ID:</strong>
                <span>{trip.hotelBookingId}</span>
              </div>
            )}
          </div>
        </Card>

        {trip.itinerary && trip.itinerary.length > 0 && (
          <Card className="itinerary-details">
            <h2>Your Itinerary</h2>
            <div className="itinerary-list">
              {trip.itinerary.map((item, index) => (
                <div key={index} className="itinerary-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    {item.category && (
                      <span className="item-category">{item.category}</span>
                    )}
                    {item.description && (
                      <p className="item-description">{item.description}</p>
                    )}
                    {item.rating && (
                      <div className="item-rating">
                        {'★'.repeat(Math.floor(item.rating))} {item.rating}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="trip-actions">
          <h3>What's Next?</h3>
          <div className="action-buttons">
            <Button 
              onClick={handlePlanAnotherTrip}
              variant="primary"
            >
              Plan Another Trip
            </Button>
            <Button 
              onClick={() => window.print()}
              variant="secondary"
            >
              Print Summary
            </Button>
            <Button 
              onClick={() => {
                const tripData = {
                  destination: trip.destination,
                  dates: `${formatDate(trip.departureDate)} - ${formatDate(trip.returnDate)}`,
                  hotel: trip.hotelName,
                  itinerary: trip.itinerary?.map(item => item.name).join(', ')
                };
                navigator.clipboard.writeText(JSON.stringify(tripData, null, 2));
                showToast('Trip details copied to clipboard!', 'success');
              }}
              variant="secondary"
            >
              Copy Details
            </Button>
            <Button 
              onClick={handleDeleteTrip}
              variant="danger"
              disabled={deleteLoading}
              loading={deleteLoading}
            >
              Delete Trip
            </Button>
          </div>
        </Card>
      </div>

      <div className="summary-footer">
        <p>Thank you for using TripEase! Have a wonderful trip to {trip.destination}! 🎉</p>
        <Button variant="secondary" onClick={handleReturnHome}>
          Return to Home
        </Button>
      </div>
    </div>
  );
}
