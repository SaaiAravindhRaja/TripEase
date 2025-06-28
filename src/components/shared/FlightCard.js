// File: src/components/shared/FlightCard.js

import React from 'react';

const FlightCard = ({ flight }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h4 className="font-semibold text-lg">{flight.airline}</h4>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-xl font-bold">{flight.departure}</span>
            <div className="flex-1 border-t border-gray-300 relative">
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-sm text-gray-600">
                {flight.duration}
              </span>
            </div>
            <span className="text-xl font-bold">{flight.arrival}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{flight.price}</div>
          <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;