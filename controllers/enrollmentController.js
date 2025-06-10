const db = require('../models');
const Enrollment = db.Enrollment;
const Course = db.Course;
const User = db.User;

exports.enrollInCourse = async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const alreadyEnrolled = await Enrollment.findOne({ where: { userId, courseId } });
    if (alreadyEnrolled) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({ userId, courseId });
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.dropCourse = async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const result = await Enrollment.destroy({ where: { userId, courseId } });
    if (result === 0) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }
    res.json({ message: 'Dropped course successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  const userId = req.params.userId;
  try {
    const courses = await Course.findAll({
      include: [{
        model: User,
        where: { id: userId },
        through: { attributes: [] }
      }]
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
