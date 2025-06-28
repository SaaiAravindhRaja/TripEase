// File: src/components/shared/AttractionCard.js

import React from 'react';
import { Star } from 'lucide-react';

const AttractionCard = ({ attraction }) => {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-32 bg-gray-200 flex items-center justify-center text-4xl">
        {attraction.image}
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-lg">{attraction.name}</h4>
        <p className="text-gray-600">{attraction.type}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="ml-1 text-sm">{attraction.rating}</span>
          </div>
          <span className="text-sm text-gray-600">{attraction.distance}</span>
        </div>
        <div className="flex space-x-2 mt-4">
          <button className="flex-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm">
            View Details
          </button>
          <button className="flex-1 bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300 text-sm">
            Add to Route
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttractionCard;