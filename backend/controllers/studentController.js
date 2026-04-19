const jwt = require('jsonwebtoken');
const { Student, Company, Application } = require('../models');

// Generate JWT Token
const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
    expiresIn: '24h'
  });
};

// @desc    Register a new student
// @route   POST /api/students/register
// @access  Public
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, department, year, resumeLink } = req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ where: { email } });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Create new student
    const student = await Student.create({
      name,
      email,
      password,
      department,
      year,
      resumeLink
    });

    // Generate token
    const token = generateToken(student.id, student.email, 'student');

    res.status(201).json({
      message: 'Student registered successfully',
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Register student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login student
// @route   POST /api/students/login
// @access  Public
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(student.id, student.email, 'student');

    res.json({
      message: 'Login successful',
      token,
      student: {
        id: student.id,
        name: student.name,
        email: student.email,
        department: student.department,
        year: student.year,
        role: 'student'
      }
    });
  } catch (error) {
    console.error('Login student error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all companies
// @route   GET /api/students/companies
// @access  Private (Student)
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [['createdAt', 'DESC']]
    });

    // Get student applications to check which companies student has applied to
    const applications = await Application.findAll({
      where: { studentId: req.user.id }
    });

    const appliedCompanyIds = applications.map(app => app.companyId);

    // Add applied status to each company
    const companiesWithStatus = companies.map(company => ({
      ...company.toJSON(),
      hasApplied: appliedCompanyIds.includes(company.id)
    }));

    res.json(companiesWithStatus);
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Apply to a company
// @route   POST /api/students/apply/:companyId
// @access  Private (Student)
const applyToCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    // Check if company exists
    const company = await Company.findByPk(companyId);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        studentId: req.user.id,
        companyId
      }
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Already applied to this company' });
    }

    // Create application
    const application = await Application.create({
      studentId: req.user.id,
      companyId,
      status: 'Interested'
    });

    res.status(201).json({
      message: 'Application submitted successfully',
      application
    });
  } catch (error) {
    console.error('Apply to company error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get student profile
// @route   GET /api/students/profile
// @access  Private (Student)
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  getCompanies,
  applyToCompany,
  getStudentProfile
};
