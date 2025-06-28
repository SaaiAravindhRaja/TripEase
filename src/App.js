// File: src/App.js

import React, { useState } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import FlightBooking from './components/FlightBooking';
import HotelBooking from './components/HotelBooking';
import Attractions from './components/Attractions';
import MapView from './components/MapView';
import AIItinerary from './components/AIItinerary';
import './styles/globals.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [currentTrip, setCurrentTrip] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} setUser={setUser} />
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-6">
        {activeTab === 'dashboard' && <Dashboard currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} />}
        {activeTab === 'flights' && <FlightBooking />}
        {activeTab === 'hotels' && <HotelBooking />}
        {activeTab === 'attractions' && <Attractions />}
        {activeTab === 'map' && <MapView />}
        {activeTab === 'itinerary' && <AIItinerary currentTrip={currentTrip} setCurrentTrip={setCurrentTrip} />}
      </main>
    </div>
  );
};

export default App;