const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'student_id'
  },
  companyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'company_id'
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Interested'
  }
}, {
  tableName: 'applications',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['student_id', 'company_id']
    }
  ]
});

module.exports = Application;
