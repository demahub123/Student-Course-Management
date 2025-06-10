const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Course = require('./course');

const Enrollment = sequelize.define('Enrollment', {
  userId: {
    type: DataTypes.INTEGER,
    references: { model: User, key: 'id' }
  },
  courseId: {
    type: DataTypes.INTEGER,
    references: { model: Course, key: 'id' }
  }
});

User.belongsToMany(Course, { through: Enrollment });
Course.belongsToMany(User, { through: Enrollment });

module.exports = Enrollment;
