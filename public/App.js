const { useState, useEffect } = React;

function App() {
  const [activeTab, setActiveTab] = useState('flights');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [bookings, setBookings] = useState({ flights: [], hotels: [], itineraries: [] });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Flight search state
  const [flightSearch, setFlightSearch] = useState({
    from: '', to: '', departure: '', returnDate: '', passengers: 1
  });

  // Hotel search state
  const [hotelSearch, setHotelSearch] = useState({
    destination: '', checkin: '', checkout: '', guests: 1
  });

  // Itinerary generation state
  const [itineraryForm, setItineraryForm] = useState({
    destination: '', duration: 3, interests: '', budget: 1000
  });

  const [hotspots, setHotspots] = useState([]);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const response = await fetch('/api/user/bookings');
      const data = await response.json();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const searchFlights = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(flightSearch);
      const response = await fetch(`/api/flights/search?${params}`);
      const data = await response.json();
      setSearchResults(data.flights);
      setMessage('');
    } catch (error) {
      setMessage('Error searching flights. Please try again.');
    }
    setLoading(false);
  };

  const bookFlight = async (flight) => {
    setLoading(true);
    try {
      const response = await fetch('/api/flights/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flightId: flight.id,
          passengerInfo: { passengers: flightSearch.passengers },
          totalPrice: flight.price * flightSearch.passengers
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessage(`Flight booked! Confirmation: ${data.confirmationNumber}`);
        fetchUserBookings();
      }
    } catch (error) {
      setMessage('Error booking flight. Please try again.');
    }
    setLoading(false);
  };

  const searchHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(hotelSearch);
      const response = await fetch(`/api/hotels/search?${params}`);
      const data = await response.json();
      setSearchResults(data.hotels);
      setMessage('');
    } catch (error) {
      setMessage('Error searching hotels. Please try again.');
    }
    setLoading(false);
  };

  const bookHotel = async (hotel) => {
    setLoading(true);
    try {
      const checkinDate = new Date(hotelSearch.checkin);
      const checkoutDate = new Date(hotelSearch.checkout);
      const nights = Math.ceil((checkoutDate - checkinDate) / (1000 * 60 * 60 * 24));
      
      const response = await fetch('/api/hotels/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          hotelId: hotel.id,
          checkin: hotelSearch.checkin,
          checkout: hotelSearch.checkout,
          guests: hotelSearch.guests,
          totalPrice: hotel.pricePerNight * nights
        })
      });
      const data = await response.json();
      if (data.success) {
        setMessage(`Hotel booked! Confirmation: ${data.confirmationNumber}`);
        fetchUserBookings();
      }
    } catch (error) {
      setMessage('Error booking hotel. Please try again.');
    }
    setLoading(false);
  };

  const searchHotspots = async (city) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/destinations/${city}/hotspots`);
      const data = await response.json();
      setHotspots(data.hotspots);
      setMessage('');
    } catch (error) {
      setMessage('Error loading hotspots. Please try again.');
    }
    setLoading(false);
  };

  const generateItinerary = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itineraryForm)
      });
      const data = await response.json();
      if (data.success) {
        setGeneratedItinerary(data.itinerary);
        setMessage('AI itinerary generated successfully!');
        fetchUserBookings();
      }
    } catch (error) {
      setMessage('Error generating itinerary. Please try again.');
    }
    setLoading(false);
  };

  const renderFlightSearch = () => (
    <div className="card">
      <h2>Search Flights</h2>
      <div className="form-row">
        <div className="form-group">
          <label>From</label>
          <input
            type="text"
            value={flightSearch.from}
            onChange={(e) => setFlightSearch({...flightSearch, from: e.target.value})}
            placeholder="Departure city"
          />
        </div>
        <div className="form-group">
          <label>To</label>
          <input
            type="text"
            value={flightSearch.to}
            onChange={(e) => setFlightSearch({...flightSearch, to: e.target.value})}
            placeholder="Destination city"
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Departure Date</label>
          <input
            type="date"
            value={flightSearch.departure}
            onChange={(e) => setFlightSearch({...flightSearch, departure: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Return Date (Optional)</label>
          <input
            type="date"
            value={flightSearch.returnDate}
            onChange={(e) => setFlightSearch({...flightSearch, returnDate: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Passengers</label>
          <select
            value={flightSearch.passengers}
            onChange={(e) => setFlightSearch({...flightSearch, passengers: parseInt(e.target.value)})}
          >
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <button className="btn" onClick={searchFlights} disabled={loading}>
        {loading ? 'Searching...' : 'Search Flights'}
      </button>

      {searchResults.length > 0 && (
        <div>
          <h3>Available Flights (Sorted by Price)</h3>
          <div className="results-grid">
            {searchResults.map(flight => (
              <div key={flight.id} className="result-item">
                <h4>{flight.airline}</h4>
                <p><strong>{flight.from} → {flight.to}</strong></p>
                <p>Departure: {flight.departure} | Arrival: {flight.arrival}</p>
                <p>Duration: {flight.duration} | Aircraft: {flight.aircraft}</p>
                <p className="price">${flight.price.toFixed(2)} per person</p>
                <p><strong>Total: ${(flight.price * flightSearch.passengers).toFixed(2)}</strong></p>
                <button className="btn btn-secondary" onClick={() => bookFlight(flight)}>
                  Book Flight
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderHotelSearch = () => (
    <div className="card">
      <h2>Search Hotels</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            value={hotelSearch.destination}
            onChange={(e) => setHotelSearch({...hotelSearch, destination: e.target.value})}
            placeholder="City or destination"
          />
        </div>
        <div className="form-group">
          <label>Check-in Date</label>
          <input
            type="date"
            value={hotelSearch.checkin}
            onChange={(e) => setHotelSearch({...hotelSearch, checkin: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Check-out Date</label>
          <input
            type="date"
            value={hotelSearch.checkout}
            onChange={(e) => setHotelSearch({...hotelSearch, checkout: e.target.value})}
          />
        </div>
        <div className="form-group">
          <label>Guests</label>
          <select
            value={hotelSearch.guests}
            onChange={(e) => setHotelSearch({...hotelSearch, guests: parseInt(e.target.value)})}
          >
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      <button className="btn" onClick={searchHotels} disabled={loading}>
        {loading ? 'Searching...' : 'Search Hotels'}
      </button>

      {searchResults.length > 0 && (
        <div>
          <h3>Available Hotels (Sorted by Price)</h3>
          <div className="results-grid">
            {searchResults.map(hotel => (
              <div key={hotel.id} className="result-item">
                <h4>{hotel.name}</h4>
                <p>⭐ {hotel.rating}/5 | {hotel.city}</p>
                <p>Amenities: {hotel.amenities.join(', ')}</p>
                <p className="price">${hotel.pricePerNight.toFixed(2)} per night</p>
                <p><strong>Status: {hotel.available ? 'Available' : 'Sold Out'}</strong></p>
                {hotel.available && (
                  <button className="btn btn-secondary" onClick={() => bookHotel(hotel)}>
                    Book Hotel
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderDestinations = () => (
    <div className="card">
      <h2>Tourist Hotspots</h2>
      <div className="form-group">
        <label>Search Destination</label>
        <input
          type="text"
          placeholder="Enter city name (e.g., London, Paris, Tokyo)"
          onKeyPress={(e) => {
            if (e.key === 'Enter' && e.target.value) {
              searchHotspots(e.target.value);
            }
          }}
        />
        <button 
          className="btn" 
          onClick={() => {
            const input = document.querySelector('input[placeholder*="city name"]');
            if (input.value) searchHotspots(input.value);
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Explore Hotspots'}
        </button>
      </div>

      {hotspots.length > 0 && (
        <div>
          <h3>Popular Attractions</h3>
          <div className="results-grid">
            {hotspots.map(spot => (
              <div key={spot.id} className="result-item">
                <h4>{spot.name}</h4>
                <p><strong>Category:</strong> {spot.category}</p>
                <p><strong>Rating:</strong> ⭐ {spot.rating}/5</p>
                <p>{spot.description}</p>
                <p><strong>Visit Time:</strong> {spot.estimatedVisitTime}</p>
                <p><strong>Entry Fee:</strong> {spot.entryFee > 0 ? `$${spot.entryFee}` : 'Free'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderItinerary = () => (
    <div className="card">
      <h2>AI Itinerary Generator</h2>
      <div className="form-row">
        <div className="form-group">
          <label>Destination</label>
          <input
            type="text"
            value={itineraryForm.destination}
            onChange={(e) => setItineraryForm({...itineraryForm, destination: e.target.value})}
            placeholder="City or destination"
          />
        </div>
        <div className="form-group">
          <label>Duration (days)</label>
          <select
            value={itineraryForm.duration}
            onChange={(e) => setItineraryForm({...itineraryForm, duration: parseInt(e.target.value)})}
          >
            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} day{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Interests</label>
          <input
            type="text"
            value={itineraryForm.interests}
            onChange={(e) => setItineraryForm({...itineraryForm, interests: e.target.value})}
            placeholder="e.g., museums, food, nightlife, nature"
          />
        </div>
        <div className="form-group">
          <label>Budget ($)</label>
          <input
            type="number"
            value={itineraryForm.budget}
            onChange={(e) => setItineraryForm({...itineraryForm, budget: parseInt(e.target.value)})}
            min="100"
            max="10000"
          />
        </div>
      </div>
      <button className="btn" onClick={generateItinerary} disabled={loading}>
        {loading ? 'Generating...' : 'Generate AI Itinerary'}
      </button>

      {generatedItinerary && (
        <div>
          <h3>Your Personalized Itinerary</h3>
          <p><strong>Destination:</strong> {generatedItinerary.destination}</p>
          <p><strong>Duration:</strong> {generatedItinerary.duration} days</p>
          <p><strong>Total Budget:</strong> ${generatedItinerary.totalBudget}</p>
          
          {generatedItinerary.days.map(day => (
            <div key={day.day} className="itinerary-day">
              <h4>Day {day.day} - {day.date}</h4>
              <p><strong>Daily Budget:</strong> ${day.dailyBudget}</p>
              {day.activities.map((activity, index) => (
                <div key={index} className="activity">
                  <h5>{activity.time} - {activity.activity}</h5>
                  <p>{activity.description}</p>
                  <p><strong>Duration:</strong> {activity.duration} | <strong>Cost:</strong> ${activity.estimatedCost}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderBookings = () => (
    <div className="card">
      <h2>My Bookings & Itineraries</h2>
      
      {bookings.flights.length > 0 && (
        <div>
          <h3>Flight Bookings</h3>
          {bookings.flights.map(booking => (
            <div key={booking.id} className="result-item">
              <p><strong>Confirmation:</strong> FL{booking.id}</p>
              <p><strong>Flight:</strong> {booking.flightId}</p>
              <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          ))}
        </div>
      )}

      {bookings.hotels.length > 0 && (
        <div>
          <h3>Hotel Bookings</h3>
          {bookings.hotels.map(booking => (
            <div key={booking.id} className="result-item">
              <p><strong>Confirmation:</strong> HT{booking.id}</p>
              <p><strong>Hotel:</strong> {booking.hotelId}</p>
              <p><strong>Check-in:</strong> {booking.checkin}</p>
              <p><strong>Check-out:</strong> {booking.checkout}</p>
              <p><strong>Total Price:</strong> ${booking.totalPrice}</p>
              <p><strong>Status:</strong> {booking.status}</p>
            </div>
          ))}
        </div>
      )}

      {bookings.itineraries.length > 0 && (
        <div>
          <h3>Generated Itineraries</h3>
          {bookings.itineraries.map(itinerary => (
            <div key={itinerary.id} className="result-item">
              <p><strong>Destination:</strong> {itinerary.destination}</p>
              <p><strong>Duration:</strong> {itinerary.duration} days</p>
              <p><strong>Budget:</strong> ${itinerary.totalBudget}</p>
            </div>
          ))}
        </div>
      )}

      {bookings.flights.length === 0 && bookings.hotels.length === 0 && bookings.itineraries.length === 0 && (
        <p>No bookings yet. Start planning your trip!</p>
      )}
    </div>
  );

  return (
    <div className="container">
      <div className="header">
        <h1>✈️ Trip Planner</h1>
        <p>Your ultimate travel companion for flights, hotels, and personalized itineraries</p>
      </div>

      {message && (
        <div className={message.includes('Error') ? 'error' : 'success'}>
          {message}
        </div>
      )}

      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'flights' ? 'active' : ''}`}
          onClick={() => setActiveTab('flights')}
        >
          ✈️ Flights
        </button>
        <button 
          className={`nav-tab ${activeTab === 'hotels' ? 'active' : ''}`}
          onClick={() => setActiveTab('hotels')}
        >
          🏨 Hotels
        </button>
        <button 
          className={`nav-tab ${activeTab === 'destinations' ? 'active' : ''}`}
          onClick={() => setActiveTab('destinations')}
        >
          🗺️ Destinations
        </button>
        <button 
          className={`nav-tab ${activeTab === 'itinerary' ? 'active' : ''}`}
          onClick={() => setActiveTab('itinerary')}
        >
          🤖 AI Itinerary
        </button>
        <button 
          className={`nav-tab ${activeTab === 'bookings' ? 'active' : ''}`}
          onClick={() => setActiveTab('bookings')}
        >
          📋 My Bookings
        </button>
      </div>

      {activeTab === 'flights' && renderFlightSearch()}
      {activeTab === 'hotels' && renderHotelSearch()}
      {activeTab === 'destinations' && renderDestinations()}
      {activeTab === 'itinerary' && renderItinerary()}
      {activeTab === 'bookings' && renderBookings()}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));