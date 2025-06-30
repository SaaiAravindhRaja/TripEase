const dotenv = require('dotenv');
const path = require('path');

class EnvironmentConfig {
  static load() {
    // Debug: Print current working directory and env file path
    console.log('🔍 Current working directory:', process.cwd());
    
    // Look for .env file in parent directory (project root)
    const envPath = path.join(__dirname, '../../.env');
    console.log('🔍 Looking for .env file at:', envPath);

    // Load environment variables from .env in parent directory
    dotenv.config({ path: envPath });

    // Debug: Print some environment variables (without showing sensitive data)
    console.log('🔍 Environment variables loaded:');
    console.log('   - NODE_ENV:', process.env.NODE_ENV || 'not set');
    console.log('   - PORT:', process.env.PORT || 'not set');
    console.log('   - MONGO_URI:', process.env.MONGO_URI ? 'set' : 'NOT SET');
    console.log('   - JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'NOT SET');

    // Verify essential environment variables
    this.validateEnvironment();
  }

  static validateEnvironment() {
    const requiredVars = ['MONGO_URI'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      console.error('❌ Missing required environment variables:', missingVars);
      console.error('Please check your .env file');
      process.exit(1);
    }

    if (!process.env.JWT_SECRET) {
      console.warn('⚠️  JWT_SECRET not set, using default (not secure for production)');
    }
  }

  static get(key, defaultValue = null) {
    return process.env[key] || defaultValue;
  }
}

module.exports = EnvironmentConfig;
