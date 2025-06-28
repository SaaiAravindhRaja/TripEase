// File: src/components/MapView.js

import React, { useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

const MapView = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive Map</h2>
        <div className="relative">
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Navigation className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Interactive Map View</p>
              <p className="text-sm text-gray-500 mt-2">Click on locations to get directions</p>
            </div>
          </div>
          <div className="absolute top-4 left-4 bg-white p-3 rounded-lg shadow">
            <input
              type="text"
              placeholder="Search locations..."
              className="border rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Route Planning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Your Route</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Hotel Grand Plaza</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <MapPin className="h-4 w-4 text-green-600" />
                <span>Eiffel Tower</span>
              </div>
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                <MapPin className="h-4 w-4 text-red-600" />
                <span>Louvre Museum</span>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Route Details</h4>
            <div className="space-y-2 text-sm">
              <p><strong>Total Distance:</strong> 8.4 km</p>
              <p><strong>Estimated Time:</strong> 45 minutes</p>
              <p><strong>Transport:</strong> Walking + Metro</p>
              <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                Start Navigation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;