const jwt = require('jsonwebtoken');

class AuthMiddleware {
  static authenticate(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Expects "Bearer TOKEN"

    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided, authorization denied',
        error: 'MISSING_TOKEN'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user; // Attach user payload (user ID) to request
      next();
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      return res.status(401).json({ 
        message: 'Token is not valid',
        error: 'INVALID_TOKEN'
      });
    }
  }

  static optionalAuth(req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.user;
    } catch (err) {
      req.user = null;
    }
    
    next();
  }
}

module.exports = AuthMiddleware;
