// File: src/components/FlightBooking.js

import React, { useState } from 'react';
import FlightCard from './shared/FlightCard';

const FlightBooking = () => {
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departure: '',
    return: '',
    passengers: 1
  });
  const [flights, setFlights] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    // Simulate API call
    setTimeout(() => {
      setFlights([
        { id: 1, airline: 'Singapore Airlines', departure: '08:00', arrival: '14:30', price: '$850', duration: '6h 30m' },
        { id: 2, airline: 'Emirates', departure: '12:15', arrival: '18:45', price: '$920', duration: '6h 30m' },
        { id: 3, airline: 'Cathay Pacific', departure: '16:30', arrival: '22:00', price: '$780', duration: '5h 30m' }
      ]);
      setSearching(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Book Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="From"
            value={searchData.from}
            onChange={(e) => setSearchData({...searchData, from: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="To"
            value={searchData.to}
            onChange={(e) => setSearchData({...searchData, to: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="date"
            value={searchData.departure}
            onChange={(e) => setSearchData({...searchData, departure: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="date"
            value={searchData.return}
            onChange={(e) => setSearchData({...searchData, return: e.target.value})}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>

      {flights.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Available Flights</h3>
          <div className="space-y-4">
            {flights.map((flight) => (
              <FlightCard key={flight.id} flight={flight} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBooking;