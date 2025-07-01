const express = require('express');
const cors = require('cors');
const EnvironmentConfig = require('./config/environment');
const DatabaseConfig = require('./config/database');

// Import Routes
const authRoutes = require('./routes/auth');
const flightRoutes = require('./routes/flights');
const hotelRoutes = require('./routes/hotels');
const itineraryRoutes = require('./routes/itinerary');
const tripRoutes = require('./routes/trips');

class TripEaseServer {
  constructor() {
    this.app = express();
    this.PORT = process.env.PORT || 5001;
    
    this.initializeEnvironment();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  initializeEnvironment() {
    // Load environment variables
    EnvironmentConfig.load();
  }

  initializeMiddleware() {
    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : ['http://localhost:3000', 'http://localhost:3001'],
      credentials: true
    }));

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Request logging middleware (development only)
    if (process.env.NODE_ENV !== 'production') {
      this.app.use((req, res, next) => {
        console.log(`🌐 ${req.method} ${req.path} - ${new Date().toISOString()}`);
        next();
      });
    }
  }

  initializeRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        service: 'TripEase API',
        version: '1.0.0'
      });
    });

    // API Routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/flights', flightRoutes);
    this.app.use('/api/hotels', hotelRoutes);
    this.app.use('/api/itinerary', itineraryRoutes);
    this.app.use('/api/trips', tripRoutes);

    // 404 handler for API routes
    this.app.use('/api/*', (req, res) => {
      res.status(404).json({ 
        message: 'API endpoint not found',
        path: req.path,
        method: req.method
      });
    });

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({ 
        message: 'Welcome to TripEase API',
        version: '1.0.0',
        documentation: '/api/docs',
        health: '/health'
      });
    });
  }

  initializeErrorHandling() {
    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('❌ Unhandled error:', error);
      
      res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { 
          stack: error.stack,
          error: error 
        })
      });
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ Unhandled Promise Rejection:', err);
      this.shutdown();
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (err) => {
      console.error('❌ Uncaught Exception:', err);
      this.shutdown();
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('🛑 SIGTERM received, shutting down gracefully');
      this.shutdown();
    });

    process.on('SIGINT', () => {
      console.log('🛑 SIGINT received, shutting down gracefully');
      this.shutdown();
    });
  }

  async connectDatabase() {
    try {
      await DatabaseConfig.connect();
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  async start() {
    try {
      // Connect to database
      const dbConnected = await this.connectDatabase();
      if (!dbConnected) {
        process.exit(1);
      }

      // Start server
      this.server = this.app.listen(this.PORT, () => {
        console.log('\n🚀 ====================================');
        console.log('🎯 TripEase API Server Started');
        console.log('🌐 Server running on http://localhost:' + this.PORT);
        console.log('📊 Environment:', process.env.NODE_ENV || 'development');
        console.log('💾 Database: Connected');
        console.log('⏰ Started at:', new Date().toISOString());
        console.log('🚀 ====================================\n');
      });

    } catch (error) {
      console.error('❌ Server startup failed:', error);
      process.exit(1);
    }
  }

  async shutdown() {
    console.log('🛑 Starting graceful shutdown...');
    
    if (this.server) {
      this.server.close(async () => {
        console.log('🔒 HTTP server closed');
        
        try {
          await DatabaseConfig.disconnect();
          console.log('💾 Database disconnected');
        } catch (error) {
          console.error('❌ Error during database disconnect:', error);
        }
        
        console.log('✅ Graceful shutdown completed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new TripEaseServer();
  server.start();
}

module.exports = TripEaseServer;
