import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import Toast, { useToast } from '../ui/Toast';

export default function HotelSearch({ destination, departureDate, returnDate, flightBookingId }) {
  const router = useRouter();
  const [checkInDate, setCheckInDate] = useState(departureDate || '');
  const [checkOutDate, setCheckOutDate] = useState(returnDate || '');
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();


  useEffect(() => {
    if (destination && checkInDate && checkOutDate) {
      handleSearchHotels();
    }
  }, [destination]);

  const handleSearchHotels = async (e) => {
    e?.preventDefault();
    if (!checkInDate || !checkOutDate) {
      showToast('Please select both check-in and check-out dates', 'error');
      return;
    }

    // Date validation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (checkIn < today) {
      showToast('Check-in date cannot be in the past', 'error');
      return;
    }

    if (checkOut <= checkIn) {
      showToast('Check-out date must be after check-in date', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5001/api/hotels/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, checkInDate, checkOutDate }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setHotels(data.hotels);
        setSelectedHotel(null);
        showToast(`Found ${data.hotels.length} hotels in ${destination}`, 'success');
      } else {
        showToast(data.message || 'Failed to search hotels', 'error');
        setHotels([]);
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      showToast('Network error. Please check your connection and try again', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBookHotel = async () => {
    console.log('🏨 Starting hotel booking...');
    console.log('Selected hotel:', selectedHotel);
    
    if (!selectedHotel) {
      showToast('Please select a hotel first', 'warning');
      return;
    }

    setBookingLoading(true);
    
    try {
      const destination = selectedHotel.destinationCity || selectedHotel.destination;
      const redirectUrl = `/itinerary?destination=${encodeURIComponent(destination)}&departureDate=${checkInDate}&returnDate=${checkOutDate}&hotelName=${encodeURIComponent(selectedHotel.name)}&hotelBookingId=test-${Date.now()}`;
      
      console.log('🧭 Redirecting to:', redirectUrl);
      
      // Use window.location.href for reliable navigation
      window.location.href = redirectUrl;
      
    } catch (error) {
      console.error('Hotel booking error:', error);
      showToast('Error during hotel booking', 'error');
      setBookingLoading(false);
    }
  };

  return (
    <div className="hotel-search">
      <ToastContainer />
      
      <div className="search-actions">
        <Button 
          onClick={() => {
            console.log('🔙 Back to flights clicked');
            router.push('/flights');
          }} 
          variant="secondary"
          className="back-button"
        >
          ← Back to Flights
        </Button>
      </div>

      <Card className="search-form-card">
        <h2>Search Hotels</h2>
        <form onSubmit={handleSearchHotels} className="hotel-search-form">
          <div className="form-row">
            <Input
              type="date"
              label="Check-in Date"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              required
            />
            <Input
              type="date"
              label="Check-out Date"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search Hotels'}
            </Button>
          </div>
        </form>
      </Card>

      {loading && <Loading message="Searching for hotels..." />}

      {hotels.length > 0 && !loading && (
        <div className="results-section">
          <h3>Available Hotels ({hotels.length} found)</h3>
          <div className="hotels-grid">
            {hotels.map((hotel) => (
              <Card 
                key={hotel.id} 
                className={`hotel-card ${selectedHotel?.id === hotel.id ? 'selected' : ''}`}
                onClick={() => setSelectedHotel(hotel)}
              >
                <div className="hotel-info">
                  <h4>{hotel.name}</h4>
                  <div className="rating">
                    {'★'.repeat(hotel.rating)} {hotel.rating} Stars
                  </div>
                  <p className="address">{hotel.address}</p>
                  <div className="price">
                    <span className="amount">${hotel.pricePerNight}</span>
                    <span className="period">per night</span>
                  </div>
                </div>
                {selectedHotel?.id === hotel.id && (
                  <div className="selected-indicator">✓ Selected</div>
                )}
              </Card>
            ))}
          </div>
          
          {selectedHotel && (
            <div className="booking-section">
              <Card className="booking-card">
                <h4>Booking Summary</h4>
                <p><strong>Hotel:</strong> {selectedHotel.name}</p>
                <p><strong>Check-in:</strong> {checkInDate}</p>
                <p><strong>Check-out:</strong> {checkOutDate}</p>
                <p><strong>Total Cost:</strong> ${selectedHotel.pricePerNight} per night</p>
                
                <Button 
                  onClick={handleBookHotel} 
                  disabled={bookingLoading}
                  variant="primary"
                  className="book-button"
                >
                  {bookingLoading ? 'Booking...' : 'Book Selected Hotel'}
                </Button>
              </Card>
            </div>
          )}
        </div>
      )}

      {!loading && hotels.length === 0 && destination && (
        <Card className="no-results">
          <h3>No Hotels Found</h3>
          <p>No hotels found for {destination} with the selected dates. Please try different dates or check the destination.</p>
        </Card>
      )}

      <div className="page-actions">
        <Button 
          onClick={() => {
            console.log('🏠 Return to home clicked');
            router.push('/');
          }} 
          variant="secondary"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
