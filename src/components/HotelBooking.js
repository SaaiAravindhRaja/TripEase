// File: src/components/HotelBooking.js

import React, { useState } from 'react';
import HotelCard from './shared/HotelCard';

const HotelBooking = () => {
  const [hotels] = useState([
    { id: 1, name: 'Grand Plaza Hotel', rating: 4.5, price: '$150', location: 'City Center', image: '🏨' },
    { id: 2, name: 'Seaside Resort', rating: 4.8, price: '$220', location: 'Beachfront', image: '🏖️' },
    { id: 3, name: 'Mountain Lodge', rating: 4.3, price: '$180', location: 'Mountain View', image: '🏔️' }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Find Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Destination"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Check-in"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <input
            type="date"
            placeholder="Check-out"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Search Hotels
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Available Hotels</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;