import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import HotelSearch from '../components/hotels/HotelSearch';
import Toast, { useToast } from '../components/ui/Toast';

export default function Hotels() {
  const router = useRouter();
  const { destination, departureDate, returnDate, flightBookingId } = router.query;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast, ToastContainer } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Create mock user for testing instead of redirecting
        setUser({ id: 'test', name: 'Test User', email: 'test@example.com' });
        showToast('Using demo mode for hotel booking', 'info');
      }
    } else {
      // Create mock user for testing instead of redirecting
      setUser({ id: 'test', name: 'Test User', email: 'test@example.com' });
      showToast('Demo mode: You can search and book hotels', 'info');
    }
    setLoading(false);
  }, []); // Empty dependency array - this should only run once on mount

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Logged out successfully. See you next time!', 'success');
    router.push('/');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Hotels in {destination || 'Your Destination'} - TripEase</title>
        </Head>
        <Layout>
          <div className="loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading...</p>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Hotels in {destination || 'Your Destination'} - TripEase</title>
        <meta name="description" content="Find and book the perfect hotel for your trip with TripEase" />
      </Head>
      
      <Layout user={user} onLogout={handleLogout}>
        <ToastContainer />
        <div className="hotels-page">
          <div className="page-header">
            <h1 className="page-title">Hotels in {destination || 'Your Destination'}</h1>
            <p className="page-subtitle">
              Choose from our selection of quality accommodations for your stay
            </p>
          </div>
          <HotelSearch 
            destination={destination}
            departureDate={departureDate}
            returnDate={returnDate}
            flightBookingId={flightBookingId}
          />
        </div>
      </Layout>
    </>
  );
}
