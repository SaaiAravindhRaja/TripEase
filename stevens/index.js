// frontend/pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link'; // Import Link for navigation
import { useRouter } from 'next/router';
// import '../styles/globals.css';

export default function Home() {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userTrips, setUserTrips] = useState([]); // New state for user trips
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserTrips(token); // Fetch trips when logged in
    }
  }, []);

  const fetchUserTrips = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/api/trips/my-trips', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUserTrips(data.trips);
      } else if (response.status === 401) {
        alert(data.message || 'Session expired. Please log in again.');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } else {
        alert(data.message || 'Failed to fetch your trips.');
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      alert('Network error. Could not fetch your trips.');
    }
  };


  const handleSearchFlights = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to search for flights.');
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ origin, destination, departureDate, returnDate }),
      });
      const data = await response.json();
      if (response.ok) {
        setFlights(data.flights);
        setSelectedFlight(null);
      } else if (response.status === 401) {
        alert(data.message || 'Session expired. Please log in again.');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setFlights([]);
      } else {
        alert(data.message || 'Failed to search flights.');
        setFlights([]);
      }
    } catch (error) {
      console.error('Flight search error:', error);
      alert('Network error. Could not connect to backend.');
      setFlights([]);
    }
  };

  const handleBookFlight = async () => {
    if (!selectedFlight) {
      alert('Please select a flight first.');
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to book a flight.');
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/flights/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ flightId: selectedFlight.id }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        // MODIFIED: Pass flightBookingId to hotels page
        router.push(`/hotels?destination=${destination}&departureDate=${departureDate}&returnDate=${returnDate}&flightBookingId=${data.flightBookingId}`);
      } else if (response.status === 401) {
        alert(data.message || 'Session expired. Please log in again.');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } else {
        alert(data.message || 'Failed to book flight.');
      }
    } catch (error) {
      console.error('Flight booking error:', error);
      alert('Network error. Could not connect to backend.');
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';
    const body = { email, password };
    if (!isLogin) body.name = email.split('@')[0];

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          alert('Logged in successfully!');
          setIsLoggedIn(true);
          setEmail('');
          setPassword('');
          fetchUserTrips(data.token); // Fetch trips immediately after login
        } else {
          alert('Registered successfully! Please login.');
          setIsLogin(true);
        }
      } else {
        alert(data.message || 'Authentication failed.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      alert('Network error. Could not connect to backend.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setFlights([]);
    setOrigin('');
    setDestination('');
    setDepartureDate('');
    setReturnDate('');
    setSelectedFlight(null);
    setUserTrips([]); // Clear trips on logout
    alert('Logged out successfully.');
  };

  const toggleMenu = () => setShowMenu(!showMenu);


  return (
    <div class={"container"}style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
      <Head>
        <title>Trip Planner</title>
        <meta name="description" content="Plan your perfect trip!" />
      </Head>

      {/* --- NAVBAR SECTION --- */}
      {isLoggedIn && (
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          width: '100%', // Explicitly set to full-width
          backgroundColor: '#FFFFFF', // Moved background color here
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)' // Shadow for elevation
        }}>
          {/* This inner container aligns navbar content with the page content below */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: '1280px', // Example max-width, adjust as needed
            margin: '0 auto', // Centers the content container
            padding: '1rem 2rem' // Padding for content inside the navbar
          }}>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#3B82F6' , font: 'proxima nova'}}>TripEase</h1>
            <div className="userMenuContainer">
              <button onClick={toggleMenu} className="userButton">
                👤
              </button>
              {showMenu && (
                <div className="dropdownMenu">
                  <button className="dropdownButton">Settings</button>
                  <button className="dropdownButton">Account</button>
                  <button className="dropdownButton">Help</button>
                  <hr className="hr" />
                  <button onClick={handleLogout} className="logoutButton">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      <main className="p-4">
        <h2 className="text-xl mb-4">Plan Your Perfect Trip!</h2>

        {!isLoggedIn ? (
          <section className="auth-section">
            <h2>{isLogin ? 'Login' : 'Register'} to Plan Your Trip</h2>
            <form onSubmit={handleAuthSubmit} className="form auth-form">
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
            <p className="toggleText">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <span onClick={() => setIsLogin(!isLogin)} className="toggleLink">
                {isLogin ? 'Register here.' : 'Login here.'}
              </span>
            </p>
          </section>
        ) : (
          <>
            <section className="welcome-section">
              <h2>Welcome! Start Planning Your Flight.</h2>
            </section>

            {/* NEW: My Trips Section */}
            <section className="my-trips-section">
              <h2>My Saved Trips</h2>
              {userTrips.length === 0 ? (
                <p>You haven't saved any trips yet. Start planning one!</p>
              ) : (
                <div className="trips-list">
                  {userTrips.map(trip => (
                    <Link key={trip._id} href={`/summary?tripId=${trip._id}`} passHref>
                      <div className="item-card trip-card">
                        <h3>{trip.name}</h3>
                        <p>Destination: {trip.destination}</p>
                        <p>Dates: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>


            <section className="search-section">
              <h2>Find Flights</h2>
              <form onSubmit={handleSearchFlights} className="form flight-search-form">
                <input type="text" placeholder="Origin (e.g., NYC)" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
                <input type="text" placeholder="Destination (e.g., LAX)" value={destination} onChange={(e) => setDestination(e.target.value)} required />
                <input type="date" placeholder="Departure Date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required />
                <input type="date" placeholder="Return Date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} />
                <button type="submit">Search Flights</button>
              </form>

              {flights.length > 0 && (
                <div className="results-section">
                  <h3>Available Flights:</h3>
                  {flights.map((flight) => (
                    <div key={flight.id} className={`item-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`} onClick={() => setSelectedFlight(flight)}>
                      <p><strong>{flight.airline}</strong>: {flight.origin} to {flight.destination}</p>
                      <p>{flight.departureTime} - {flight.arrivalTime}</p>
                      <p>Price: ${flight.price}</p>
                    </div>
                  ))}
                  {selectedFlight && (
                    <button onClick={handleBookFlight} className="action-button">Book Selected Flight</button>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </main>
    </div>
  );
}