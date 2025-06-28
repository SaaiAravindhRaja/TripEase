// File: src/components/Header.js

import React from 'react';
import { Plane } from 'lucide-react';

const Header = ({ user, setUser }) => {
  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Plane className="h-8 w-8" />
          <h1 className="text-2xl font-bold">TripEase</h1>
        </div>
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-2">
              <span>Welcome, {user.name}!</span>
              <button 
                onClick={() => setUser(null)}
                className="bg-blue-700 px-3 py-1 rounded hover:bg-blue-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setUser({ name: 'John Doe', id: 1 })}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;