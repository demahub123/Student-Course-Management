const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Course = sequelize.define('Course', {
  name: DataTypes.STRING,
  instructor: DataTypes.STRING,
  credits: DataTypes.INTEGER
});

module.exports = Course;
