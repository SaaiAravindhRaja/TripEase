// File: src/components/Attractions.js

import React, { useState } from 'react';
import AttractionCard from './shared/AttractionCard';

const Attractions = () => {
  const [attractions] = useState([
    { id: 1, name: 'Eiffel Tower', type: 'Landmark', rating: 4.6, distance: '2.3 km', image: '🗼' },
    { id: 2, name: 'Café de Flore', type: 'Restaurant', rating: 4.4, distance: '1.8 km', image: '☕' },
    { id: 3, name: 'Louvre Museum', type: 'Museum', rating: 4.7, distance: '3.1 km', image: '🏛️' },
    { id: 4, name: 'Seine River Cruise', type: 'Activity', rating: 4.5, distance: '2.0 km', image: '🚢' }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredAttractions = filter === 'all' 
    ? attractions 
    : attractions.filter(attraction => attraction.type.toLowerCase() === filter);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Discover Attractions</h2>
        <div className="flex space-x-4 mb-6">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('restaurant')}
            className={`px-4 py-2 rounded-lg ${filter === 'restaurant' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Restaurants
          </button>
          <button
            onClick={() => setFilter('landmark')}
            className={`px-4 py-2 rounded-lg ${filter === 'landmark' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Landmarks
          </button>
          <button
            onClick={() => setFilter('museum')}
            className={`px-4 py-2 rounded-lg ${filter === 'museum' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Museums
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAttractions.map((attraction) => (
            <AttractionCard key={attraction.id} attraction={attraction} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Attractions;