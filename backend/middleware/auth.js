const jwt = require('jsonwebtoken');
const { Student, Coordinator } = require('../models');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if user is a student
    if (decoded.role === 'student') {
      const student = await Student.findByPk(decoded.id);
      if (!student) {
        return res.status(401).json({ message: 'Student not found' });
      }
      req.user = { id: decoded.id, role: 'student', email: decoded.email };
    } 
    // Check if user is a coordinator
    else if (decoded.role === 'coordinator') {
      const coordinator = await Coordinator.findByPk(decoded.id);
      if (!coordinator) {
        return res.status(401).json({ message: 'Coordinator not found' });
      }
      req.user = { id: decoded.id, role: 'coordinator', email: decoded.email };
    }

    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Middleware for student-only routes
const studentAuth = (req, res, next) => {
  if (req.user && req.user.role === 'student') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Students only.' });
  }
};

// Middleware for coordinator-only routes
const coordinatorAuth = (req, res, next) => {
  if (req.user && req.user.role === 'coordinator') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Coordinators only.' });
  }
};

module.exports = { auth, studentAuth, coordinatorAuth };
