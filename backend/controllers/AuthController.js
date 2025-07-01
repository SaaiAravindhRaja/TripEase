const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Mock data store for development
let mockUsers = [];
let mockUserId = 1;

// Initialize with a test user for development
if (process.env.NODE_ENV === 'development_mock') {
  // Create test user synchronously
  const testUser = {
    _id: mockUserId++,
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$XM2yLyJWIgTqwongg3uz6eyTFiY00A4oX/Alt31QAfaSb4dCO4skC', // hashed 'password123'
  };
  mockUsers.push(testUser);
  console.log('🧪 Mock test user initialized: test@example.com / password123');
}

class AuthController {
  static async register(req, res) {
    try {
      const { email, password, name } = req.body;

      // Mock mode for development
      if (process.env.NODE_ENV === 'development_mock') {
        // Check if user already exists
        const existingUser = mockUsers.find(u => u.email === email);
        if (existingUser) {
          return res.status(400).json({ 
            message: 'User already exists with this email address' 
          });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create mock user
        const user = {
          _id: mockUserId++,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          password: hashedPassword,
        };

        mockUsers.push(user);

        return res.status(201).json({ 
          message: 'User registered successfully',
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      }

      // Regular MongoDB mode
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists with this email address' 
        });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const user = new User({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({ 
        message: 'User registered successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        message: 'Server error during registration',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Mock mode for development
      if (process.env.NODE_ENV === 'development_mock') {
        // Initialize test user if it doesn't exist
        if (mockUsers.length === 0) {
          const testUser = {
            _id: mockUserId++,
            name: 'Test User',
            email: 'test@example.com',
            password: '$2a$10$XM2yLyJWIgTqwongg3uz6eyTFiY00A4oX/Alt31QAfaSb4dCO4skC', // hashed 'password123'
          };
          mockUsers.push(testUser);
          console.log('🧪 Mock test user initialized: test@example.com / password123');
        }

        // Find user by email
        const user = mockUsers.find(u => u.email === email.toLowerCase().trim());
        if (!user) {
          return res.status(400).json({ 
            message: 'Invalid email or password' 
          });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ 
            message: 'Invalid email or password' 
          });
        }

        // Create JWT token
        const payload = {
          user: {
            id: user._id,
            email: user.email,
            name: user.name
          },
        };

        const token = jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return res.json({ 
          token,
          message: 'Logged in successfully',
          user: {
            id: user._id,
            name: user.name,
            email: user.email
          }
        });
      }

      // Regular MongoDB mode
      // Find user by email
      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        return res.status(400).json({ 
          message: 'Invalid email or password' 
        });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ 
          message: 'Invalid email or password' 
        });
      }

      // Create JWT token
      const payload = {
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        },
      };

      const token = jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '24h' } // Token expires in 24 hours
      );

      res.json({ 
        token,
        message: 'Logged in successfully',
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        message: 'Server error during login',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id)
        .select('-password')
        .populate('trips', 'name destination startDate endDate status');

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ user });
    } catch (error) {
      console.error('Profile fetch error:', error);
      res.status(500).json({ 
        message: 'Server error fetching profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  static async updateProfile(req, res) {
    try {
      const { name } = req.body;
      const userId = req.user.id;

      const user = await User.findByIdAndUpdate(
        userId,
        { name: name.trim() },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({ 
        message: 'Profile updated successfully',
        user 
      });
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ 
        message: 'Server error updating profile',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = AuthController;
