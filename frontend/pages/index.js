import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/layout/Layout';
import AuthForm from '../components/auth/AuthForm';
import FlightSearch from '../components/flights/FlightSearch';
import TripsDashboard from '../components/trips/TripsDashboard';
import Toast, { useToast } from '../components/ui/Toast';

export default function Home() {
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
      }
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    showToast('Logged out successfully. See you next time!', 'success');
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>TripEase - Plan Your Perfect Trip</title>
        </Head>
        <Layout>
          <div className="loading">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading TripEase...</p>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>TripEase - Plan Your Perfect Trip</title>
        <meta name="description" content="Plan your perfect trip with TripEase. Search flights, book hotels, and create amazing itineraries." />
        <meta name="keywords" content="travel, trip planning, flights, hotels, itinerary" />
      </Head>

      <Layout user={user} onLogout={handleLogout}>
        <ToastContainer />

        <div className="home-page">
          {/* Hero Section */}
          <div className="page-header">
            <h1 className="page-title">Welcome to TripEase</h1>
            <p className="page-subtitle">
              Plan your perfect trip with ease. Search flights, book hotels, and create amazing itineraries all in one place.
            </p>
          </div>

          {!user ? (
            // Show authentication form for non-logged-in users
            <div className="auth-section">
              <AuthForm onAuthSuccess={handleAuthSuccess} />
            </div>
          ) : (
            // Show main app content for logged-in users
            <div className="main-app-content">
              {/* User's Trips Dashboard */}
              <TripsDashboard user={user} />
              
              {/* Flight Search Section */}
              <div id="flight-search" className="flight-search-section">
                <div className="section-header">
                  <h2 className="section-title">Start Planning Your Next Trip</h2>
                  <p className="section-subtitle">Search for flights to begin your journey</p>
                </div>
                <FlightSearch />
              </div>
            </div>
          )}

          {/* Features Section */}
          {!user && (
            <div className="features-section">
              <div className="features-grid">
                <div className="feature-card">
                  <div className="feature-icon">✈️</div>
                  <h3>Flight Search</h3>
                  <p>Find the best flights for your destination with our comprehensive search engine.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🏨</div>
                  <h3>Hotel Booking</h3>
                  <p>Book the perfect accommodation that suits your needs and budget.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">🗓️</div>
                  <h3>Itinerary Planning</h3>
                  <p>Create detailed itineraries with activities, restaurants, and attractions.</p>
                </div>
                <div className="feature-card">
                  <div className="feature-icon">📱</div>
                  <h3>Trip Management</h3>
                  <p>Keep all your trip details organized in one convenient dashboard.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>

      <style jsx>{`
        .home-page {
          max-width: 1200px;
          margin: 0 auto;
        }

        .auth-section {
          margin: 2rem 0;
        }

        .main-app-content {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .flight-search-section {
          margin-top: 3rem;
        }

        .section-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .section-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.9);
        }

        .features-section {
          margin-top: 4rem;
          padding: 3rem 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #718096;
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .features-grid {
            grid-template-columns: 1fr;
          }
          
          .section-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}
