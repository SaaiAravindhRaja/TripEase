import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import ItineraryPlanner from '../components/trips/ItineraryPlanner';
import Toast, { useToast } from '../components/ui/Toast';

export default function Itinerary() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [queryParams, setQueryParams] = useState({});
  const { showToast, ToastContainer } = useToast();

  console.log('🗓️ Itinerary page router.query:', router.query);
  console.log('🗓️ Itinerary page router.isReady:', router.isReady);

  useEffect(() => {
    console.log('🗓️ Itinerary useEffect running...');
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
        console.log('🗓️ User loaded from localStorage');
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // For testing, create a mock user instead of redirecting
        setUser({ id: 'test', name: 'Test User', email: 'test@example.com' });
        showToast('Using test user for demo', 'info');
        console.log('🗓️ Created mock user due to parse error');
      }
    } else {
      // For testing, allow access without login by creating a mock user
      console.log('🗓️ No user token, creating mock user for testing');
      setUser({ id: 'test', name: 'Test User', email: 'test@example.com' });
      showToast('Viewing itinerary in demo mode', 'info');
    }
    setLoading(false);
    console.log('🗓️ Itinerary loading set to false');
  }, []); // Empty dependency array to run once

  // Parse query parameters with better hydration handling
  useEffect(() => {
    const parseParams = () => {
      // Try Next.js router first (when ready)
      if (router.isReady && Object.keys(router.query).length > 0) {
        console.log('🗓️ Using router.query:', router.query);
        const params = {
          destination: router.query.destination || 'Tokyo',
          departureDate: router.query.departureDate || '2025-07-01',
          returnDate: router.query.returnDate || '2025-07-08',
          hotelName: router.query.hotelName || 'Grand Hotel Tokyo',
          flightBookingId: router.query.flightBookingId || 'flight123',
          hotelBookingId: router.query.hotelBookingId || 'hotel456'
        };
        setQueryParams(params);
        return;
      }
      
      // Fallback to window.location.search (client-side only)
      if (typeof window !== 'undefined') {
        console.log('🗓️ Using window.location.search:', window.location.search);
        const urlParams = new URLSearchParams(window.location.search);
        const params = {
          destination: urlParams.get('destination') || 'Tokyo',
          departureDate: urlParams.get('departureDate') || '2025-07-01',
          returnDate: urlParams.get('returnDate') || '2025-07-08',
          hotelName: urlParams.get('hotelName') || 'Grand Hotel Tokyo',
          flightBookingId: urlParams.get('flightBookingId') || 'flight123',
          hotelBookingId: urlParams.get('hotelBookingId') || 'hotel456'
        };
        setQueryParams(params);
        console.log('🗓️ Final params set:', params);
      }
    };

    // Try immediately
    parseParams();
    
    // Also try after a small delay for hydration
    const timeoutId = setTimeout(parseParams, 100);
    
    return () => clearTimeout(timeoutId);
  }, [router.isReady, router.query]);

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
          <title>Plan Your Itinerary - {queryParams.destination || 'Your Destination'} - TripEase</title>
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
        <title>Plan Your Itinerary - {queryParams.destination || 'Your Destination'} - TripEase</title>
        <meta name="description" content="Plan your perfect trip itinerary with TripEase" />
      </Head>
      
      <Layout user={user} onLogout={handleLogout}>
        <ToastContainer />
        <ItineraryPlanner 
          destination={queryParams.destination}
          departureDate={queryParams.departureDate}
          returnDate={queryParams.returnDate}
          hotelName={queryParams.hotelName}
          flightBookingId={queryParams.flightBookingId}
          hotelBookingId={queryParams.hotelBookingId}
        />
      </Layout>
    </>
  );
}
