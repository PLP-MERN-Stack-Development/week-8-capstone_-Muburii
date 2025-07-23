// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id)
        .populate('teacherId')
        .populate('studentId')
        .populate('parentId');

      if (!user) {
        return res.status(401).json({ message: 'User account not found' });
      }

      // Check role permissions
      if (roles.length > 0 && !roles.includes(user.role)) {
        return res.status(403).json({ 
          message: `Access forbidden for ${user.role} role`
        });
      }

      req.user = user;
      next();
    } catch (err) {
      console.error('Authentication error:', err.message);
      
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired, please login again' });
      }
      
      res.status(401).json({ message: 'Invalid authentication token' });
    }
  };
};

module.exports = { requireAuth };