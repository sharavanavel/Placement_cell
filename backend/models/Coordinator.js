const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const Coordinator = sequelize.define('Coordinator', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Coordinator'
  }
}, {
  tableName: 'coordinators',
  timestamps: true,
  hooks: {
    beforeCreate: async (coordinator) => {
      if (coordinator.password) {
        const salt = await bcrypt.genSalt(10);
        coordinator.password = await bcrypt.hash(coordinator.password, salt);
      }
    }
  }
});

Coordinator.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

Coordinator.prototype.toJSON = function() {
  const values = { ...this.get() };
  delete values.password;
  return values;
};

module.exports = Coordinator;
