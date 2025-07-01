import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import FlightSearch from '../components/flights/FlightSearch';
import Toast, { useToast } from '../components/ui/Toast';

export default function Flights() {
  const router = useRouter();
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
        showToast('Session expired. Please log in again.', 'error');
        router.push('/');
      }
    } else {
      // No user token, redirect to home
      showToast('Please log in to search for flights.', 'warning');
      router.push('/');
      return;
    }
    setLoading(false);
  }, []); // Empty dependency array - authentication check should only run once on mount

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
          <title>Search Flights - TripEase</title>
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
        <title>Search Flights - TripEase</title>
        <meta name="description" content="Find and book the best flights for your next trip with TripEase" />
      </Head>
      
      <Layout user={user} onLogout={handleLogout}>
        <ToastContainer />
        <div className="flights-page">
          <FlightSearch />
        </div>
      </Layout>
    </>
  );
}
