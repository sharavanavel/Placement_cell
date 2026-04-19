const { sequelize } = require('../config/db');
const Student = require('./Student');
const Coordinator = require('./Coordinator');
const Company = require('./Company');
const Application = require('./Application');

// Student - Application associations
Student.hasMany(Application, { foreignKey: 'studentId', as: 'applications' });
Application.belongsTo(Student, { foreignKey: 'studentId', as: 'student' });

// Company - Application associations
Company.hasMany(Application, { foreignKey: 'companyId', as: 'applications' });
Application.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Coordinator - Company associations
Coordinator.hasMany(Company, { foreignKey: 'createdBy', as: 'companies' });
Company.belongsTo(Coordinator, { foreignKey: 'createdBy', as: 'coordinator' });

module.exports = {
  sequelize,
  Student,
  Coordinator,
  Company,
  Application
};
