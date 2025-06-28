// File: src/components/shared/ItineraryDay.js

import React from 'react';
import { MapPin } from 'lucide-react';

const ItineraryDay = ({ day, dayData }) => {
  return (
    <div className="border rounded-lg p-4">
      <h4 className="text-lg font-semibold mb-3 capitalize">{day}: {dayData.title}</h4>
      <div className="space-y-3">
        {dayData.activities.map((activity, index) => (
          <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded">
            <div className="text-sm font-medium text-blue-600 w-20">{activity.time}</div>
            <div className="flex-1">
              <p className="font-medium">{activity.activity}</p>
              <p className="text-sm text-gray-600">Duration: {activity.duration}</p>
            </div>
            <button className="text-blue-600 hover:text-blue-800">
              <MapPin className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDay;