const express = require('express');
const router = express.Router();
const { 
  loginCoordinator, 
  addCompany, 
  getCoordinatorCompanies, 
  getCompanyApplications,
  getCoordinatorProfile,
  deleteCompany
} = require('../controllers/coordinatorController');
const { auth, coordinatorAuth } = require('../middleware/auth');

// Public routes
router.post('/login', loginCoordinator);

// Protected routes - Coordinator only
router.post('/companies', auth, coordinatorAuth, addCompany);
router.get('/companies', auth, coordinatorAuth, getCoordinatorCompanies);
router.get('/companies/:companyId/applications', auth, coordinatorAuth, getCompanyApplications);
router.delete('/companies/:companyId', auth, coordinatorAuth, deleteCompany);
router.get('/profile', auth, coordinatorAuth, getCoordinatorProfile);

module.exports = router;
