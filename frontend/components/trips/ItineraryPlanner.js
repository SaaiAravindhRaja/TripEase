import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Loading from '../ui/Loading';
import Toast, { useToast } from '../ui/Toast';

export default function ItineraryPlanner({ 
  destination, 
  departureDate, 
  returnDate, 
  hotelName, 
  flightBookingId, 
  hotelBookingId 
}) {
  console.log('📋 ItineraryPlanner received props:', { destination, departureDate, returnDate, hotelName, flightBookingId, hotelBookingId });
  
  const router = useRouter();
  const [itinerary, setItinerary] = useState([]);
  const [poiSearchTerm, setPoiSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const { showToast, ToastContainer } = useToast();


  useEffect(() => {
    console.log('📋 ItineraryPlanner useEffect running - loading mock data once');
    loadMockItinerary();
  }, []); // Empty dependency array to run only once

  const loadMockItinerary = () => {
    const safeDestination = destination || 'Your Destination';
    console.log('📋 Loading mock itinerary for destination:', safeDestination);
    setLoading(true);
    
    // Mock data for demo purposes
    const mockItinerary = [
      {
        id: 1,
        name: `${safeDestination} City Center`,
        category: 'Attraction',
        description: `Explore the heart of ${safeDestination} with historic landmarks and shopping.`,
        rating: 4.5
      },
      {
        id: 2,
        name: 'Local Restaurant',
        category: 'Restaurant',
        description: `Authentic local cuisine in ${safeDestination}.`,
        rating: 4.2
      },
      {
        id: 3,
        name: `${safeDestination} Museum`,
        category: 'Museum',
        description: `Learn about the history and culture of ${safeDestination}.`,
        rating: 4.3
      }
    ];

    const mockRecommendations = {
      restaurants: [
        `Top-rated restaurant in ${safeDestination}`,
        `Local cuisine specialties`,
        `Rooftop dining with city views`
      ],
      attractions: [
        `${safeDestination} landmark tours`,
        `Historical sites`,
        `Scenic viewpoints`
      ],
      activities: [
        `Walking tours`,
        `Local markets`,
        `Cultural experiences`
      ]
    };

    // Simulate loading time
    setTimeout(() => {
      setItinerary(mockItinerary);
      setRecommendations(mockRecommendations);
      setLoading(false);
      console.log('📋 Mock itinerary loaded successfully');
      showToast('Itinerary loaded successfully!', 'success');
    }, 1000);
  };

  const handleSearchPOI = (e) => {
    e.preventDefault();
    if (!poiSearchTerm.trim()) {
      showToast('Please enter a search term', 'warning');
      return;
    }

    setSearchLoading(true);
    
    // Mock search results for demo
    const mockResults = [
      {
        id: Date.now() + 1,
        name: `${poiSearchTerm} in ${destination}`,
        category: 'Restaurant',
        description: `Popular ${poiSearchTerm.toLowerCase()} spot in ${destination}`,
        rating: 4.1
      },
      {
        id: Date.now() + 2,
        name: `${destination} ${poiSearchTerm} Experience`,
        category: 'Attraction',
        description: `Must-visit ${poiSearchTerm.toLowerCase()} attraction`,
        rating: 4.4
      },
      {
        id: Date.now() + 3,
        name: `Local ${poiSearchTerm} Tour`,
        category: 'Activity',
        description: `Guided ${poiSearchTerm.toLowerCase()} experience`,
        rating: 4.2
      }
    ];

    // Simulate search delay
    setTimeout(() => {
      setSearchResults(mockResults);
      setSearchLoading(false);
      showToast(`Found ${mockResults.length} points of interest`, 'success');
    }, 500);
  };

  const addToItinerary = (poi) => {
    if (itinerary.some(item => item.id === poi.id)) {
      showToast('This location is already in your itinerary', 'warning');
      return;
    }
    
    setItinerary([...itinerary, poi]);
    showToast(`Added ${poi.name} to your itinerary`, 'success');
  };

  const removeFromItinerary = (poiId) => {
    setItinerary(itinerary.filter(item => item.id !== poiId));
    showToast('Removed from itinerary', 'success');
  };

  const saveItinerary = () => {
    setSaveLoading(true);
    
    // Create unique trip ID
    const tripId = Date.now();
    
    // Create comprehensive trip data
    const tripData = {
      destination,
      departureDate,
      returnDate,
      hotelName,
      itinerary,
      flightBookingId,
      hotelBookingId,
      savedAt: new Date().toISOString(),
      id: tripId
    };
    
    console.log('💾 SAVING TRIP DATA:');
    console.log('💾 Destination:', destination);
    console.log('💾 Departure:', departureDate);
    console.log('💾 Return:', returnDate);
    console.log('💾 Hotel:', hotelName);
    console.log('💾 Full trip data:', tripData);
    
    try {
      // Save to multiple locations for reliability
      localStorage.setItem('savedTrip', JSON.stringify(tripData));
      localStorage.setItem(`trip-${tripId}`, JSON.stringify(tripData));
      
      // Verify the save worked
      const verifyKey1 = localStorage.getItem('savedTrip');
      const verifyKey2 = localStorage.getItem(`trip-${tripId}`);
      
      console.log('💾 Trip saved with ID:', tripId);
      console.log('💾 Verification - savedTrip exists:', !!verifyKey1);
      console.log('💾 Verification - trip-${tripId} exists:', !!verifyKey2);
      console.log('💾 All localStorage keys after save:', Object.keys(localStorage));
      
      showToast('Itinerary saved successfully! Redirecting to summary...', 'success');
      
      setTimeout(() => {
        setSaveLoading(false);
        // Use window.location for reliable navigation
        window.location.href = `/summary?tripId=${tripId}`;
      }, 1500);
    } catch (error) {
      console.error('Save error:', error);
      setSaveLoading(false);
      showToast('Error saving itinerary', 'error');
    }
  };

  if (loading) {
    return <Loading message="Generating your personalized itinerary..." />;
  }

  return (
    <div className="itinerary-planner">
      <ToastContainer />
      
      <div className="itinerary-header">
        <h1>Plan Your Itinerary for {destination}</h1>
        <div className="trip-details">
          <span>{departureDate} to {returnDate}</span>
          {hotelName && <span> • Staying at {hotelName}</span>}
        </div>
        <Button 
          onClick={() => router.back()} 
          variant="secondary"
          className="back-button"
        >
          ← Back to Hotels
        </Button>
      </div>

      <div className="itinerary-content">
        <div className="search-section">
          <Card>
            <h2>Search Points of Interest</h2>
            <form onSubmit={handleSearchPOI} className="poi-search-form">
              <div className="search-input-group">
                <Input
                  type="text"
                  placeholder="Search for restaurants, attractions, activities..."
                  value={poiSearchTerm}
                  onChange={(e) => setPoiSearchTerm(e.target.value)}
                />
                <Button type="submit" disabled={searchLoading}>
                  {searchLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </form>
          </Card>

          {searchResults.length > 0 && (
            <Card className="search-results">
              <h3>Search Results</h3>
              <div className="poi-grid">
                {searchResults.map((poi) => (
                  <div key={poi.id} className="poi-card">
                    <h4>{poi.name}</h4>
                    <p className="poi-type">{poi.category}</p>
                    <p className="poi-description">{poi.description}</p>
                    {poi.rating && (
                      <div className="rating">
                        {'★'.repeat(Math.floor(poi.rating))} {poi.rating}
                      </div>
                    )}
                    <Button 
                      onClick={() => addToItinerary(poi)}
                      variant="secondary"
                      size="small"
                    >
                      Add to Itinerary
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="itinerary-section">
          <Card>
            <h2>Your Itinerary</h2>
            {itinerary.length > 0 ? (
              <div className="itinerary-list">
                {itinerary.map((item, index) => (
                  <div key={item.id} className="itinerary-item">
                    <div className="item-number">{index + 1}</div>
                    <div className="item-content">
                      <h4>{item.name}</h4>
                      <p className="item-type">{item.category}</p>
                      <p className="item-description">{item.description}</p>
                      {item.rating && (
                        <div className="rating">
                          {'★'.repeat(Math.floor(item.rating))} {item.rating}
                        </div>
                      )}
                    </div>
                    <Button 
                      onClick={() => removeFromItinerary(item.id)}
                      variant="danger"
                      size="small"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-itinerary">
                Your itinerary is empty. Search for points of interest above to add them.
              </p>
            )}
          </Card>

          {recommendations && (
            <Card className="recommendations">
              <h3>Recommended for You</h3>
              <div className="recommendations-content">
                {recommendations.restaurants && (
                  <div className="recommendation-section">
                    <h4>🍽️ Restaurants</h4>
                    <ul>
                      {recommendations.restaurants.map((restaurant, index) => (
                        <li key={index}>{restaurant}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendations.attractions && (
                  <div className="recommendation-section">
                    <h4>🎯 Attractions</h4>
                    <ul>
                      {recommendations.attractions.map((attraction, index) => (
                        <li key={index}>{attraction}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {recommendations.activities && (
                  <div className="recommendation-section">
                    <h4>🎈 Activities</h4>
                    <ul>
                      {recommendations.activities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>

      <div className="itinerary-actions">
        <Button 
          onClick={saveItinerary} 
          disabled={saveLoading || itinerary.length === 0}
          variant="primary"
          className="save-button"
        >
          {saveLoading ? 'Saving...' : 'Save Itinerary & Continue'}
        </Button>
        <Button 
          onClick={() => router.push('/')} 
          variant="secondary"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
}
