// File: src/components/Dashboard.js

import React, { useState } from 'react';
import { Plane, Hotel, Star, Brain } from 'lucide-react';
import QuickActionCard from './shared/QuickActionCard';

const Dashboard = ({ currentTrip, setCurrentTrip }) => {
  const [trips, setTrips] = useState([
    { id: 1, destination: 'Paris, France', dates: 'Jul 15-22, 2025', status: 'Active' },
    { id: 2, destination: 'Tokyo, Japan', dates: 'Aug 10-18, 2025', status: 'Planned' }
  ]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">Your Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <div key={trip.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg">{trip.destination}</h3>
              <p className="text-gray-600">{trip.dates}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded text-sm ${
                trip.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {trip.status}
              </span>
              <button 
                onClick={() => setCurrentTrip(trip)}
                className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionCard icon={Plane} title="Book Flight" color="blue" />
          <QuickActionCard icon={Hotel} title="Find Hotel" color="green" />
          <QuickActionCard icon={Star} title="Discover Places" color="purple" />
          <QuickActionCard icon={Brain} title="AI Planner" color="orange" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;