class ValidationMiddleware {
  static validateRegistration(req, res, next) {
    const { email, password, name } = req.body;
    const errors = [];

    if (!name || name.trim().length < 2) {
      errors.push('Name must be at least 2 characters long');
    }

    if (!email || !ValidationMiddleware.isValidEmail(email)) {
      errors.push('Valid email is required');
    }

    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    next();
  }

  static validateLogin(req, res, next) {
    const { email, password } = req.body;
    const errors = [];

    if (!email) {
      errors.push('Email is required');
    }

    if (!password) {
      errors.push('Password is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    next();
  }

  static validateFlightSearch(req, res, next) {
    const { origin, destination, departureDate } = req.body;
    const errors = [];

    if (!origin) {
      errors.push('Origin is required');
    }

    if (!destination) {
      errors.push('Destination is required');
    }

    if (!departureDate) {
      errors.push('Departure date is required');
    }

    if (errors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors 
      });
    }

    next();
  }

  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = ValidationMiddleware;
