const mongoose = require('mongoose');
const path = require('path');

class DatabaseConfig {
  static connect() {
    // Skip MongoDB in development_mock mode
    if (process.env.NODE_ENV === 'development_mock') {
      console.log('🔧 Running in mock mode - skipping MongoDB connection');
      return Promise.resolve(true);
    }

    // Verify MongoDB URI exists
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI environment variable is not set!');
      console.error('Please check your .env file exists and contains MONGO_URI');
      console.error('Expected .env file location:', path.join(process.cwd(), '.env'));
      process.exit(1);
    }

    // Connect to MongoDB
    return mongoose.connect(process.env.MONGO_URI)
      .then(() => {
        console.log('✅ MongoDB connected successfully');
        return true;
      })
      .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        console.error('💡 Tip: Make sure MongoDB is running locally or use MongoDB Atlas');
        process.exit(1);
      });
  }

  static disconnect() {
    return mongoose.disconnect();
  }
}

module.exports = DatabaseConfig;
