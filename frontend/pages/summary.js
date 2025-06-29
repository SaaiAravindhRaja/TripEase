// frontend/pages/summary.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
// import '../styles/globals.css';

export default function TripSummary() {
  const router = useRouter();
  const { tripId } = router.query;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTripDetails = async () => {
      if (!tripId) {
        setError('No trip ID provided. Please navigate from a planned trip or "My Trips".');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/'); // Redirect to login
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await response.json();

        if (response.ok) {
          setTrip(data.trip);
        } else if (response.status === 401) {
          alert(data.message || 'Session expired. Please log in again.');
          localStorage.removeItem('token');
          router.push('/');
        } else {
          setError(data.message || 'Failed to fetch trip details.');
        }
      } catch (err) {
        console.error('Error fetching trip details:', err);
        setError('Network error. Could not load trip details.');
      } finally {
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId, router]); // Re-fetch if tripId or router changes

  if (loading) {
    return (
      <div className="container">
        <Head><title>Trip Summary - Loading...</title></Head>
        <main className="main">
          <h1 className="title">Loading Your Trip Summary...</h1>
          <p>Please wait.</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Head><title>Trip Summary - Error</title></Head>
        <main className="main">
          <h1 className="title">Error Loading Trip</h1>
          <p className="description">{error}</p>
          <Link href="/" passHref>
            <button className="action-button logoutButton">Go Home</button>
          </Link>
        </main>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="container">
        <Head><title>Trip Not Found</title></Head>
        <main className="main">
          <h1 className="title">Trip Not Found</h1>
          <p className="description">The trip you are looking for does not exist or you do not have access.</p>
          <Link href="/" passHref>
            <button className="action-button logoutButton">Go Home</button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Trip Summary: {trip.name}</title>
      </Head>

      <main className="main">
        <h1 className="title">Your Trip Summary</h1>
        <h2 className="trip-name">{trip.name}</h2>
        <p className="description">
          Destination: <strong>{trip.destination}</strong> | Dates: <strong>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</strong>
        </p>

        {trip.flightBooking && (
          <section className="summary-section flight-summary">
            <h3>Flight Details</h3>
            <p>Airline: <strong>{trip.flightBooking.airline}</strong></p>
            <p>From: <strong>{trip.flightBooking.origin}</strong> To: <strong>{trip.flightBooking.destination}</strong></p>
            <p>Departure: {new Date(trip.flightBooking.departureDate).toLocaleDateString()} | Return: {new Date(trip.flightBooking.returnDate).toLocaleDateString()}</p>
            <p>Price: ${trip.flightBooking.price}</p>
          </section>
        )}

        {trip.hotelBooking && (
          <section className="summary-section hotel-summary">
            <h3>Hotel Details</h3>
            <p>Hotel: <strong>{trip.hotelBooking.hotelName}</strong></p>
            <p>Destination: {trip.hotelBooking.destination}</p>
            <p>Check-in: {new Date(trip.hotelBooking.checkInDate).toLocaleDateString()} | Check-out: {new Date(trip.hotelBooking.checkOutDate).toLocaleDateString()}</p>
            <p>Price per night: ${trip.hotelBooking.pricePerNight}</p>
          </section>
        )}

        {trip.itinerary && (
          <section className="summary-section itinerary-summary">
            <h3>Your Itinerary</h3>
            {trip.itinerary.days.map((day, index) => (
              <div key={index} className="day-card">
                <h4>Day {index + 1}: {new Date(day.date).toLocaleDateString()}</h4>
                <ul>
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex}>
                      {activity.time && <span>{activity.time}: </span>}
                      {activity.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        <Link href="/" passHref>
          <button className="action-button logoutButton">Start New Trip or View My Trips</button>
        </Link>
      </main>
    </div>
  );
}