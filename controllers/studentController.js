const db = require('../models');
const Enrollment = db.Enrollment;
const Course = db.Course;

exports.enrollInCourse = async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const enrollment = await Enrollment.create({ userId, courseId });
    res.status(201).json({ message: 'Enrolled successfully', enrollment });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.dropCourse = async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    await Enrollment.destroy({ where: { userId, courseId } });
    res.json({ message: 'Course dropped successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  const userId = req.params.userId;
  try {
    const courses = await Course.findAll({
      include: [{
        model: db.User,
        where: { id: userId },
        through: { attributes: [] } // hide join table
      }]
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
