// frontend/pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
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
  const [userTrips, setUserTrips] = useState([]);

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

  // NEW: handleCancelTrip function
  const handleCancelTrip = async (tripId, tripName) => {
    if (!window.confirm(`Are you sure you want to cancel the trip "${tripName}"? This action cannot be undone.`)) {
      return; // User cancelled
    }

    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to cancel a trip.');
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: 'DELETE', // Use DELETE method
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        fetchUserTrips(token); // Refresh the list of trips
      } else if (response.status === 401) {
        alert(data.message || 'Session expired. Please log in again.');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      } else {
        alert(data.message || 'Failed to cancel trip.');
      }
    } catch (error) {
      console.error('Error cancelling trip:', error);
      alert('Network error. Could not connect to backend to cancel trip.');
    }
  };


  return (
    <div className="container">
      <Head>
        <title>Trip Planner - Home</title>
        <meta name="description" content="Plan your perfect trip!" />
      </Head>

      <main className="main">
        <h1 className="title">Plan Your Perfect Trip!</h1>

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
                <button onClick={handleLogout} className="action-button logoutButton">Logout</button>
            </section>

            {/* My Trips Section */}
            <section className="my-trips-section">
                <h2>My Saved Trips</h2>
                {userTrips.length === 0 ? (
                    <p>You haven't saved any trips yet. Start planning one!</p>
                ) : (
                    <div className="trips-list">
                        {userTrips.map(trip => (
                            <div key={trip._id} className="item-card trip-card">
                                <Link href={`/summary?tripId=${trip._id}`} passHref>
                                    <div> {/* Wrap content in a div for Link to apply */}
                                        <h3>{trip.name}</h3>
                                        <p>Destination: {trip.destination}</p>
                                        <p>Dates: {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                                    </div>
                                </Link>
                                {/* NEW: Cancel button */}
                                <button
                                  onClick={() => handleCancelTrip(trip._id, trip.name)}
                                  className="cancel-trip-button"
                                  title="Cancel this trip and delete all its data"
                                >
                                  Cancel Trip
                                </button>
                            </div>
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
            <div className="actions">
              <button onClick={() => router.push('/')} className="action-button logoutButton">Leave and come back later</button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}