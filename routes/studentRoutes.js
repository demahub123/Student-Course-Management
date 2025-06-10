const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/enroll', studentController.enrollInCourse);
router.post('/drop', studentController.dropCourse);
router.get('/:userId/courses', studentController.getEnrolledCourses);

module.exports = router;
