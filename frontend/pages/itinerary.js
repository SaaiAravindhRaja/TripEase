// frontend/pages/itinerary.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
// import '../styles/globals.css';

export default function Itinerary() {
  const router = useRouter();
  const { destination, departureDate, returnDate, hotelName, flightBookingId, hotelBookingId } = router.query;

  const [itinerary, setItinerary] = useState([]);
  const [poiSearchTerm, setPoiSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItinerary = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to generate itinerary.');
      router.push('/');
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/itinerary/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ destination, departureDate, returnDate, hotelName }),
      });
      const data = await response.json();
      if (response.ok) {
        setItinerary(data.itinerary);
        setRecommendations(data.recommendations);
      } else if (response.status === 401) {
          alert(data.message || 'Session expired. Please log in again.');
          localStorage.removeItem('token');
          router.push('/');
      } else {
        setError(data.message || 'Failed to generate itinerary.');
      }
    } catch (err) {
      console.error('Itinerary generation error:', err);
      setError('Network error. Could not connect to backend to generate itinerary.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalizeItinerary = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to finalize your trip.');
      router.push('/');
      return;
    }

    if (itinerary.length === 0) {
      alert('Cannot finalize an empty itinerary. Please add some activities.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/trips/finalize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          destination,
          departureDate,
          returnDate,
          hotelName,
          finalItinerary: itinerary,
          flightBookingId: flightBookingId || null,
          hotelBookingId: hotelBookingId || null,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Trip finalized and saved! Redirecting to summary.');
        router.push(`/summary?tripId=${data.tripId}`);
      } else if (response.status === 401) {
          alert(data.message || 'Session expired. Please log in again.');
          localStorage.removeItem('token');
          router.push('/');
      } else {
        alert(data.message || 'Failed to finalize trip.');
      }
    } catch (err) {
      console.error('Finalize trip error:', err);
      alert('Network error. Could not connect to backend to finalize trip.');
    }
  };


  useEffect(() => {
    if (destination && departureDate && returnDate && hotelName) {
      fetchItinerary();
    } else {
      setError('Missing trip details. Please start from flight booking.');
      setLoading(false);
    }
  }, [destination, departureDate, returnDate, hotelName]);

  const handlePoiSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/poi/search?q=${poiSearchTerm}`);
      const data = await response.json();
      if (response.ok) {
        setSearchResults(data.pois);
      } else {
        alert(data.message || 'Failed to search places.');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('POI search error:', error);
      alert('Network error. Could not connect to backend.');
    }
  };

  const handleAddPoiToItinerary = (poi, dayIndex) => {
    setItinerary(prevItinerary => {
      const newItinerary = [...prevItinerary];
      if (newItinerary[dayIndex]) {
        newItinerary[dayIndex].activities.push({ name: poi.name, time: 'Flexible' });
      } else {
        alert(`Day ${dayIndex + 1} does not exist in your itinerary. Add to an existing day.`);
        return prevItinerary;
      }
      return newItinerary;
    });
    alert(`${poi.name} added to Day ${dayIndex + 1}!`);
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    setItinerary(prevItinerary => {
      const newItinerary = [...prevItinerary];
      newItinerary[dayIndex].activities.splice(activityIndex, 1);
      return newItinerary;
    });
    alert('Activity removed!');
  };

  if (loading) {
    return (
      <div className="container">
        <Head><title>Trip Planner - Generating Itinerary</title></Head>
        <main className="main">
          <h1 className="title">Generating Your Itinerary...</h1>
          <p>Please wait while we craft your initial trip plan.</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Head><title>Trip Planner - Error</title></Head>
        <main className="main">
          <h1 className="title">Error Generating Itinerary</h1>
          <p className="description">{error}</p>
          <button onClick={() => router.push('/')} className="action-button logoutButton">Start New Trip</button>
        </main>
      </div>
    );
  }

  return (
    <div className="container">
      <Head>
        <title>Trip Planner - Your Itinerary</title>
      </Head>

      <main className="main">
        <h1 className="title">Craft Your Perfect Itinerary for {destination}</h1>
        <p className="description">Departure: {departureDate} | Return: {returnDate} | Hotel: {hotelName}</p>

        {/* NEW: Back Button */}
        <button onClick={() => router.back()} className="action-button back-button">
          &larr; Back to Hotels
        </button>

        <section className="itinerary-section">
          <h2>Your Current Itinerary</h2>
          {itinerary.length === 0 ? (
            <p>No itinerary generated. Please try refreshing or ensuring all details were passed.</p>
          ) : (
            itinerary.map((day, index) => (
              <div key={index} className="day-card">
                <h3>Day {index + 1}: {day.date}</h3>
                <ul>
                  {day.activities.map((activity, actIndex) => (
                    <li key={actIndex}>
                      {activity.time && <span>{activity.time}: </span>}
                      {activity.name}
                      <button className="remove-button" onClick={() => handleRemoveActivity(index, actIndex)}>X</button>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        <section className="search-section">
          <h2>Search & Add Places to Itinerary</h2>
          <form onSubmit={handlePoiSearch} className="form poi-search-form">
            <input type="text" placeholder="Search for places (e.g., Museum, Park)" value={poiSearchTerm} onChange={(e) => setPoiSearchTerm(e.target.value)} />
            <button type="submit">Search Places</button>
          </form>

          {searchResults.length > 0 && (
            <div className="results-section">
              <h3>Search Results:</h3>
              {searchResults.map((poi) => (
                <div key={poi.id} className="item-card">
                  <p><strong>{poi.name}</strong> - {poi.type}</p>
                  <p>{poi.description}</p>
                  {itinerary.length > 0 && (
                    <div className="add-to-itinerary-options">
                      Add to Day:
                      {itinerary.map((_, dayIndex) => (
                        <button key={dayIndex} onClick={() => handleAddPoiToItinerary(poi, dayIndex)} className="add-button">
                          Day {dayIndex + 1}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {recommendations && (
          <section className="recommendations-section">
            <h2>Recommendations & Routes</h2>
            <div className="recommendation-card">
              <h3>Tourist Destinations Near {destination}:</h3>
              <ul>
                {recommendations.touristDestinations.map((dest, index) => (
                  <li key={index}>{dest}</li>
                ))}
              </ul>
            </div>
            <div className="recommendation-card">
              <h3>Fastest Route from Hotel to Main Attraction:</h3>
              <p>{recommendations.fastestRoute}</p>
            </div>
          </section>
        )}
        <div className="actions">
          <button onClick={handleFinalizeItinerary} className="action-button finalize-button">
            Finalize Itinerary & View Summary
          </button>
          <button onClick={() => router.push('/')} className="action-button logoutButton">Leave and come back later</button>
        </div>

      </main>
    </div>
  );
}