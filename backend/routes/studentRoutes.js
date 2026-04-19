const express = require('express');
const router = express.Router();
const { 
  registerStudent, 
  loginStudent, 
  getCompanies, 
  applyToCompany,
  getStudentProfile 
} = require('../controllers/studentController');
const { auth, studentAuth } = require('../middleware/auth');

// Public routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);

// Protected routes - Student only
router.get('/companies', auth, studentAuth, getCompanies);
router.post('/apply/:companyId', auth, studentAuth, applyToCompany);
router.get('/profile', auth, studentAuth, getStudentProfile);

module.exports = router;
