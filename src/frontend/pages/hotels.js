// frontend/pages/hotels.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import '../styles/globals.css';

export default function Hotels() {
  const router = useRouter();
  // MODIFIED: Capture flightBookingId from URL
  const { destination, departureDate, returnDate, flightBookingId } = router.query;
  const [checkInDate, setCheckInDate] = useState(departureDate || '');
  const [checkOutDate, setCheckOutDate] = useState(returnDate || '');
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    if (destination) {
      handleSearchHotels();
    }
  }, [destination, checkInDate, checkOutDate]);

  const handleSearchHotels = async (e) => {
    e?.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/hotels/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination, checkInDate, checkOutDate }),
      });
      const data = await response.json();
      if (response.ok) {
        setHotels(data.hotels);
        setSelectedHotel(null);
      } else {
        alert(data.message || 'Failed to search hotels.');
        setHotels([]);
      }
    } catch (error) {
      console.error('Hotel search error:', error);
      alert('Network error. Could not connect to backend.');
    }
  };

  const handleBookHotel = async () => {
    if (!selectedHotel) {
      alert('Please select a hotel first.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to book a hotel.');
      router.push('/');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/hotels/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          hotelId: selectedHotel.id,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message + ' Now, let\'s plan your itinerary!');
        // MODIFIED: Pass both flightBookingId and hotelBookingId
        router.push(`/itinerary?destination=${selectedHotel.destination}&departureDate=${checkInDate}&returnDate=${checkOutDate}&hotelName=${selectedHotel.name}&flightBookingId=${flightBookingId || ''}&hotelBookingId=${data.hotelBookingId}`);
      } else {
        alert(data.message || 'Failed to book hotel.');
      }
    } catch (error) {
      console.error('Hotel booking error:', error);
      alert('Network error. Could not connect to backend.');
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Trip Planner - Hotels in {destination}</title>
      </Head>

      <main className="main">
        <h1 className="title">Choose Your Accommodation in {destination}</h1>

        <section className="search-section">
          <h2>Search Hotels</h2>
          <form onSubmit={handleSearchHotels} className="form hotel-search-form">
            <input type="date" placeholder="Check-in Date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} required />
            <input type="date" placeholder="Check-out Date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} required />
            <button type="submit">Refine Search</button>
          </form>

          {hotels.length > 0 ? (
            <div className="results-section">
              <h3>Available Hotels:</h3>
              {hotels.map((hotel) => (
                <div key={hotel.id} className={`item-card ${selectedHotel?.id === hotel.id ? 'selected' : ''}`} onClick={() => setSelectedHotel(hotel)}>
                  <p><strong>{hotel.name}</strong> - {hotel.rating} Stars</p>
                  <p>{hotel.address}</p>
                  <p>Price per night: ${hotel.pricePerNight}</p>
                </div>
              ))}
              {selectedHotel && (
                <button onClick={handleBookHotel} className="action-button">Book Selected Hotel</button>
              )}
            </div>
          ) : (
            <p>No hotels found for {destination} or no dates selected. Please ensure destination and dates are correct.</p>
          )}
        </section>
      </main>
    </div>
  );
}