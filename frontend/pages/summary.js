import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import TripSummaryView from '../components/trips/TripSummaryView';
import Toast, { useToast } from '../components/ui/Toast';

export default function Summary() {
  const router = useRouter();
  const [tripId, setTripId] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  console.log('🏷️ Summary page - router.query:', router.query);
  console.log('🏷️ Summary page - router.isReady:', router.isReady);

  // Handle tripId extraction with fallback
  useEffect(() => {
    const extractTripId = () => {
      // Try Next.js router first
      if (router.isReady && router.query.tripId) {
        console.log('🏷️ Using router.query.tripId:', router.query.tripId);
        setTripId(router.query.tripId);
        return;
      }
      
      // Fallback to URL parsing
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const urlTripId = urlParams.get('tripId');
        if (urlTripId) {
          console.log('🏷️ Using URL tripId:', urlTripId);
          setTripId(urlTripId);
          return;
        }
      }
      
      // Set a fallback value
      console.log('🏷️ No tripId found, using fallback');
      setTripId('fallback');
    };

    extractTripId();
    
    // Also try after a delay for router readiness
    const timeoutId = setTimeout(extractTripId, 100);
    
    return () => clearTimeout(timeoutId);
  }, [router.isReady, router.query]);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        // Create mock user for demo
        setUser({ id: 'test', name: 'Test User', email: 'test@example.com' });
      }
    } else {
      // Create mock user for demo
      setUser({ id: 'test', name: 'Test User', email: 'test@example.com' });
    }
    setLoading(false);
  }, []);

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
          <title>Trip Summary - TripEase</title>
        </Head>
        <Layout>
          <div className="loading">Loading...</div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Trip Summary - TripEase</title>
        <meta name="description" content="View your complete trip details and summary" />
      </Head>
      
      <Layout user={user} onLogout={handleLogout}>
        <TripSummaryView tripId={tripId} />
      </Layout>
    </>
  );
}
