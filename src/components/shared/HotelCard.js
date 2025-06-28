// File: src/components/shared/HotelCard.js

import React from 'react';
import { Star } from 'lucide-react';

const HotelCard = ({ hotel }) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center text-6xl">
        {hotel.image}
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-lg">{hotel.name}</h4>
        <p className="text-gray-600">{hotel.location}</p>
        <div className="flex items-center mt-2">
          <Star className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="ml-1 text-sm">{hotel.rating}</span>
        </div>
        <div className="flex justify-between items-center mt-4">
          <span className="text-xl font-bold text-blue-600">{hotel.price}/night</span>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;