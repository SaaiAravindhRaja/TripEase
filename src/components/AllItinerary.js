// File: src/components/AIItinerary.js

import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import ItineraryDay from './shared/ItineraryDay';

const AIItinerary = ({ currentTrip, setCurrentTrip }) => {
  const [preferences, setPreferences] = useState({
    interests: [],
    budget: 'medium',
    pace: 'moderate',
    duration: 3
  });
  const [itinerary, setItinerary] = useState(null);
  const [generating, setGenerating] = useState(false);

  const interests = ['Culture', 'Food', 'Nature', 'Adventure', 'Shopping', 'Nightlife', 'Art', 'History'];

  const generateItinerary = () => {
    setGenerating(true);
    setTimeout(() => {
      setItinerary({
        day1: {
          title: 'Cultural Exploration',
          activities: [
            { time: '9:00 AM', activity: 'Visit Louvre Museum', duration: '3 hours' },
            { time: '1:00 PM', activity: 'Lunch at Café de Flore', duration: '1 hour' },
            { time: '3:00 PM', activity: 'Seine River Cruise', duration: '2 hours' },
            { time: '6:00 PM', activity: 'Dinner at Le Procope', duration: '2 hours' }
          ]
        },
        day2: {
          title: 'Iconic Landmarks',
          activities: [
            { time: '8:00 AM', activity: 'Eiffel Tower Visit', duration: '2 hours' },
            { time: '11:00 AM', activity: 'Walk along Champs-Élysées', duration: '2 hours' },
            { time: '2:00 PM', activity: 'Arc de Triomphe', duration: '1 hour' },
            { time: '4:00 PM', activity: 'Montmartre District', duration: '3 hours' }
          ]
        },
        day3: {
          title: 'Hidden Gems',
          activities: [
            { time: '10:00 AM', activity: 'Marché aux Puces Flea Market', duration: '2 hours' },
            { time: '1:00 PM', activity: 'Lunch in Le Marais', duration: '1 hour' },
            { time: '3:00 PM', activity: 'Père Lachaise Cemetery', duration: '2 hours' },
            { time: '6:00 PM', activity: 'Sunset at Sacré-Cœur', duration: '1 hour' }
          ]
        }
      });
      setGenerating(false);
    }, 2000);
  };

  const cancelItinerary = () => {
    setItinerary(null);
    setPreferences({
      interests: [],
      budget: 'medium',
      pace: 'moderate',
      duration: 3
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">AI Itinerary Planner</h2>
        
        {!itinerary ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">What are you interested in?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => {
                      const newInterests = preferences.interests.includes(interest)
                        ? preferences.interests.filter(i => i !== interest)
                        : [...preferences.interests, interest];
                      setPreferences({...preferences, interests: newInterests});
                    }}
                    className={`p-2 rounded-lg border transition-colors ${
                      preferences.interests.includes(interest)
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget</label>
                <select
                  value={preferences.budget}
                  onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="low">Budget-friendly</option>
                  <option value="medium">Moderate</option>
                  <option value="high">Luxury</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Travel Pace</label>
                <select
                  value={preferences.pace}
                  onChange={(e) => setPreferences({...preferences, pace: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="relaxed">Relaxed</option>
                  <option value="moderate">Moderate</option>
                  <option value="fast">Fast-paced</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Duration (days)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={preferences.duration}
                  onChange={(e) => setPreferences({...preferences, duration: parseInt(e.target.value)})}
                  className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={generateItinerary}
              disabled={generating || preferences.interests.length === 0}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {generating ? 'Generating Your Perfect Itinerary...' : 'Generate AI Itinerary'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Your AI-Generated Itinerary</h3>
              <div className="space-x-2">
                <button
                  onClick={cancelItinerary}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center space-x-2"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel Itinerary</span>
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center space-x-2">
                  <Check className="h-4 w-4" />
                  <span>Approve Itinerary</span>
                </button>
              </div>
            </div>

            {Object.entries(itinerary).map(([day, dayData]) => (
              <ItineraryDay key={day} day={day} dayData={dayData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIItinerary;