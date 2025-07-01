import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import Toast, { useToast } from '../ui/Toast';

export default function TripsDashboard({ user }) {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(null);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    fetchTrips();
    
    // Remove the automatic focus refresh to prevent infinite loops
    // Only manual refresh via button now
  }, []);

  const fetchTrips = async () => {
    try {

      const savedTrips = [];
      
      // Check all localStorage keys for trips
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('trip-')) {
          try {
            const tripData = JSON.parse(localStorage.getItem(key));
            if (tripData && tripData.destination) {
              // Add the trip ID from the key
              tripData.id = key.replace('trip-', '');
              tripData.status = 'Planned'; // Default status
              savedTrips.push(tripData);
            }
          } catch (e) {
            console.warn('Failed to parse trip data for key:', key);
          }
        }
      }
      
      // Also check for savedTrip (latest trip)
      const latestTrip = localStorage.getItem('savedTrip');
      if (latestTrip) {
        try {
          const tripData = JSON.parse(latestTrip);
          if (tripData && tripData.destination) {
            // Only add if not already in the list
            const exists = savedTrips.some(trip => 
              trip.destination === tripData.destination && 
              trip.departureDate === tripData.departureDate
            );
            if (!exists) {
              tripData.id = tripData.id || 'latest';
              tripData.status = 'Planned';
              savedTrips.push(tripData);
            }
          }
        } catch (e) {
          console.warn('Failed to parse latest trip data');
        }
      }
      
      // Sort trips by saved date (newest first)
      savedTrips.sort((a, b) => new Date(b.savedAt || 0) - new Date(a.savedAt || 0));
      
      setTrips(savedTrips);
      
    } catch (error) {
      console.error('Fetch trips error:', error);
      // Remove showToast call that might cause infinite loops
    } finally {
      setLoading(false);
    }
  };

  const handleCancelTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to cancel this trip? This action cannot be undone.')) {
      return;
    }

    setCancelLoading(tripId);
    try {
      // Remove from localStorage
      const tripKey = `trip-${tripId}`;
      localStorage.removeItem(tripKey);
      
      // If this is the latest trip, also remove savedTrip
      const savedTrip = localStorage.getItem('savedTrip');
      if (savedTrip) {
        try {
          const tripData = JSON.parse(savedTrip);
          if (tripData.id === tripId) {
            localStorage.removeItem('savedTrip');
          }
        } catch (e) {
          console.warn('Error checking savedTrip for removal');
        }
      }
      
      // Update the trips state immediately
      setTrips(trips.filter(trip => trip.id !== tripId));
      showToast('Trip cancelled successfully', 'success');
    } catch (error) {
      console.error('Cancel trip error:', error);
      showToast('Error cancelling trip', 'error');
    } finally {
      setCancelLoading(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'cancelled': return 'danger';
      case 'active': return 'primary';
      default: return 'secondary';
    }
  };

  if (loading) {
    return <Loading message="Loading your trips..." />;
  }

  return (
    <div className="trips-dashboard">
      <ToastContainer />
      
      <div className="dashboard-header">
        <h2>Your Trips</h2>
        <p>Welcome back, {user?.username}! Here are your planned adventures.</p>
        <Button 
          onClick={() => {
            console.log('🔄 Manual refresh clicked');
            setLoading(true);
            fetchTrips();
          }}
          variant="secondary"
          className="refresh-button"
        >
          🔄 Refresh Trips
        </Button>
      </div>

      {trips.length === 0 ? (        <Card className="empty-trips">
          <div className="empty-content">
            <h3>No Trips Yet</h3>
            <p>You haven't planned any trips yet. Ready to start your next adventure?</p>
            <Button 
              onClick={() => window.scrollTo({ top: document.getElementById('flight-search')?.offsetTop || 0, behavior: 'smooth' })}
              variant="primary"
            >
              Plan Your First Trip
            </Button>
          </div>
        </Card>
      ) : (
        <div className="trips-grid">
          {trips.map((trip) => (
            <Card key={trip._id} className="trip-card">
              <div className="trip-header">
                <h3>{trip.destination}</h3>
                <span className={`status-badge ${getStatusColor(trip.status)}`}>
                  {trip.status || 'Planned'}
                </span>
              </div>
              
              <div className="trip-details">
                <div className="trip-dates">
                  <span className="date-label">Trip Dates:</span>
                  <span className="dates">
                    {formatDate(trip.departureDate)} - {formatDate(trip.returnDate)}
                  </span>
                </div>
                
                {trip.hotelName && (
                  <div className="trip-hotel">
                    <span className="hotel-label">Hotel:</span>
                    <span className="hotel-name">{trip.hotelName}</span>
                  </div>
                )}
                
                {trip.itinerary && trip.itinerary.length > 0 && (
                  <div className="trip-itinerary">
                    <span className="itinerary-label">Planned Activities:</span>
                    <span className="itinerary-count">{trip.itinerary.length} activities</span>
                  </div>
                )}
                
                <div className="trip-created">
                  <span className="created-label">Planned on:</span>
                  <span className="created-date">{formatDate(trip.savedAt || trip.createdAt)}</span>
                </div>
              </div>
              
              <div className="trip-actions">
                <Button 
                  onClick={() => router.push(`/summary?tripId=${trip.id}`)}
                  variant="primary"
                  size="small"
                >
                  View Details
                </Button>
                <Button 
                  onClick={() => handleCancelTrip(trip.id)}
                  variant="danger"
                  size="small"
                  disabled={cancelLoading === trip._id}
                >
                  {cancelLoading === trip._id ? 'Cancelling...' : 'Cancel Trip'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
