const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Enroll a student in a course
router.post('/enroll', enrollmentController.enrollInCourse);

// Drop a course
router.post('/drop', enrollmentController.dropCourse);

// Get all courses a student is enrolled in
router.get('/:userId/courses', enrollmentController.getEnrolledCourses);

module.exports = router;
