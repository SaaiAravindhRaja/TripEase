import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import Toast, { useToast } from '../ui/Toast';

export default function FlightSearch() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: ''
  });
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchFlights = async (e) => {
    e.preventDefault();
    
    if (!searchData.origin || !searchData.destination || !searchData.departureDate) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departureDate = new Date(searchData.departureDate);
    const returnDate = searchData.returnDate ? new Date(searchData.returnDate) : null;

    if (departureDate < today) {
      showToast('Departure date cannot be in the past', 'error');
      return;
    }

    if (returnDate && returnDate <= departureDate) {
      showToast('Return date must be after departure date', 'error');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('You must be logged in to search for flights', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(searchData),
      });
      const data = await response.json();
      
      if (response.ok) {
        setFlights(data.flights);
        setSelectedFlight(null);
        showToast(`Found ${data.flights.length} flights`, 'success');
      } else if (response.status === 401) {
        showToast('Session expired. Please log in again', 'error');
        localStorage.removeItem('token');
        router.push('/');
      } else {
        showToast(data.message || 'Failed to search flights', 'error');
      }
    } catch (error) {
      console.error('Flight search error:', error);
      showToast('Network error. Please check your connection and try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = async () => {
    if (!selectedFlight) {
      showToast('Please select a flight first', 'warning');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      showToast('You must be logged in to book a flight', 'error');
      return;
    }

    setBookingLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/flights/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ flightId: selectedFlight.id }),
      });
      const data = await response.json();
      
      if (response.ok) {
        showToast('Flight booked successfully! Redirecting to hotels...', 'success');
        setTimeout(() => {
          router.push(`/hotels?destination=${searchData.destination}&departureDate=${searchData.departureDate}&returnDate=${searchData.returnDate}&flightBookingId=${data.flightBookingId}`);
        }, 1500);
      } else if (response.status === 401) {
        showToast('Session expired. Please log in again', 'error');
        localStorage.removeItem('token');
        router.push('/');
      } else {
        showToast(data.message || 'Failed to book flight', 'error');
      }
    } catch (error) {
      console.error('Flight booking error:', error);
      showToast('Network error. Please try again', 'error');
    } finally {
      setBookingLoading(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateDuration = (departure, arrival) => {
    const dep = new Date(`2000-01-01T${departure}`);
    const arr = new Date(`2000-01-01T${arrival}`);
    const diff = arr - dep;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="flight-search">
      <ToastContainer />
      
      <div className="search-header">
        <h1>Search Flights</h1>
        <p>Find the perfect flight for your next adventure</p>
        <div className="available-cities">
          <p><strong>Available destinations:</strong> New York, Los Angeles, San Francisco, Miami, Paris</p>
        </div>
      </div>

      <Card className="search-form-card">
        <form onSubmit={handleSearchFlights} className="flight-search-form">
          <div className="form-row">
            <Input
              type="text"
              label="From"
              placeholder="e.g., New York, NYC, Los Angeles"
              value={searchData.origin}
              onChange={(e) => handleInputChange('origin', e.target.value)}
              required
            />
            <Input
              type="text"
              label="To"
              placeholder="e.g., Miami, Paris, San Francisco"
              value={searchData.destination}
              onChange={(e) => handleInputChange('destination', e.target.value)}
              required
            />
          </div>
          <div className="form-row">
            <Input
              type="date"
              label="Departure Date"
              value={searchData.departureDate}
              onChange={(e) => handleInputChange('departureDate', e.target.value)}
              required
            />
            <Input
              type="date"
              label="Return Date (Optional)"
              value={searchData.returnDate}
              onChange={(e) => handleInputChange('returnDate', e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="search-button">
            {loading ? 'Searching...' : 'Search Flights'}
          </Button>
        </form>
      </Card>

      {loading && <Loading message="Searching for flights..." />}

      {flights.length > 0 && !loading && (
        <div className="results-section">
          <h3 className="available-description">Available Flights ({flights.length} found)</h3>
          <div className="flights-list">
            {flights.map((flight) => (
              <Card 
                key={flight.id} 
                className={`flight-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`}
                onClick={() => setSelectedFlight(flight)}
              >
                <div className="flight-header">
                  <div className="airline">
                    <h4>{flight.airline}</h4>
                    <span className="flight-number">{flight.flightNumber}</span>
                  </div>
                  <div className="price">
                    <span className="amount">${flight.price}</span>
                    <span className="per-person">per person</span>
                  </div>
                </div>
                
                <div className="flight-details">
                  <div className="route">
                    <div className="departure">
                      <div className="time">{formatTime(flight.departureTime)}</div>
                      <div className="city">{flight.originCity || flight.origin}</div>
                    </div>
                    <div className="flight-path">
                      <div className="duration">
                        {calculateDuration(flight.departureTime, flight.arrivalTime)}
                      </div>
                      <div className="line">────────✈────────</div>
                    </div>
                    <div className="arrival">
                      <div className="time">{formatTime(flight.arrivalTime)}</div>
                      <div className="city">{flight.destinationCity || flight.destination}</div>
                    </div>
                  </div>
                </div>

                {selectedFlight?.id === flight.id && (
                  <div className="selected-indicator">
                    <span>✓ Selected</span>
                  </div>
                )}
              </Card>
            ))}
          </div>
          
          {selectedFlight && (
            <div className="booking-section">
              <Card className="booking-card">
                <div className='confirmation-details'>
                  <h4 className="summary-header-text">Booking Summary</h4>
                  <p><strong>Flight:</strong> {selectedFlight.airline} {selectedFlight.flightNumber}</p>
                  <p><strong>Route:</strong> {selectedFlight.originCity || selectedFlight.origin} → {selectedFlight.destinationCity || selectedFlight.destination}</p>
                  <p><strong>Departure:</strong> {formatTime(selectedFlight.departureTime)}</p>
                  <p><strong>Arrival:</strong> {formatTime(selectedFlight.arrivalTime)}</p>
                  <p><strong>Price:</strong> ${selectedFlight.price} per person</p>
                  <Button 
                    onClick={handleBookFlight} 
                    disabled={bookingLoading}
                    variant="primary"
                    className="book-button"
                  >
                    {bookingLoading ? 'Booking...' : 'Book This Flight'}
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}

      {!loading && flights.length === 0 && searchData.origin && (
        <Card className="no-results">
          <h3>No Flights Found</h3>
          <p>No flights found for your search criteria. Please try different dates or locations.</p>
        </Card>
      )}
    </div>
  );
}
