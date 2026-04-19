const jwt = require('jsonwebtoken');
const { Coordinator, Company, Application, Student } = require('../models');

// Generate JWT Token
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// @desc    Login coordinator
// @route   POST /api/coordinators/login
// @access  Public
const loginCoordinator = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if coordinator exists
    const coordinator = await Coordinator.findOne({ where: { email } });
    if (!coordinator) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await coordinator.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(coordinator.id, coordinator.email, 'coordinator');

    res.json({
      message: 'Login successful',
      token,
      coordinator: {
        id: coordinator.id,
        email: coordinator.email,
        name: coordinator.name,
        role: 'coordinator'
      }
    });
  } catch (error) {
    console.error('Login coordinator error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add a new company
// @route   POST /api/coordinators/companies
// @access  Private (Coordinator)
const addCompany = async (req, res) => {
  try {
    const { companyName, lpa, role, requirements } = req.body;

    // Create company
    const company = await Company.create({
      companyName,
      lpa,
      role,
      requirements,
      createdBy: req.user.id
    });

    res.status(201).json({
      message: 'Company added successfully',
      company
    });
  } catch (error) {
    console.error('Add company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all companies added by coordinator
// @route   GET /api/coordinators/companies
// @access  Private (Coordinator)
const getCoordinatorCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      where: { createdBy: req.user.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Application,
          as: 'applications',
          include: [
            {
              model: Student,
              as: 'student',
              attributes: ['id', 'name', 'email', 'department', 'year']
            }
          ]
        }
      ]
    });

    // Format response with application count
    const companiesWithApplications = companies.map(company => ({
      ...company.toJSON(),
      applicationCount: company.applications ? company.applications.length : 0,
      interestedStudents: company.applications ? company.applications.map(app => app.student) : []
    }));

    res.json(companiesWithApplications);
  } catch (error) {
    console.error('Get coordinator companies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get applications for a specific company
// @route   GET /api/coordinators/companies/:companyId/applications
// @access  Private (Coordinator)
const getCompanyApplications = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check if company exists and belongs to this coordinator
    const company = await Company.findOne({
      where: {
        id: companyId,
        createdBy: req.user.id
      }
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found or unauthorized' });
    }

    // Get applications
    const applications = await Application.findAll({
      where: { companyId },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'department', 'year', 'resumeLink']
        }
      ]
    });

    const students = applications.map(app => ({
      ...app.student.toJSON(),
      applicationStatus: app.status,
      appliedAt: app.createdAt
    }));

    res.json({
      company: {
        id: company.id,
        companyName: company.companyName,
        lpa: company.lpa,
        role: company.role
      },
      applications: students
    });
  } catch (error) {
    console.error('Get company applications error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get coordinator profile
// @route   GET /api/coordinators/profile
// @access  Private (Coordinator)
const getCoordinatorProfile = async (req, res) => {
  try {
    const coordinator = await Coordinator.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!coordinator) {
      return res.status(404).json({ message: 'Coordinator not found' });
    }

    res.json(coordinator);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a company
// @route   DELETE /api/coordinators/companies/:companyId
// @access  Private (Coordinator)
const deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check if company exists and belongs to this coordinator
    const company = await Company.findOne({
      where: {
        id: companyId,
        createdBy: req.user.id
      }
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found or unauthorized' });
    }

    // Delete applications first
    await Application.destroy({ where: { companyId } });

    // Delete company
    await company.destroy();

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  loginCoordinator,
  addCompany,
  getCoordinatorCompanies,
  getCompanyApplications,
  getCoordinatorProfile,
  deleteCompany
};
