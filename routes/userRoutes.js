const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// --- User routes ---
// This route handles adding a new student
router.post('/students/add', userController.addStudent);
// List all users (dashboard)
router.get('/', userController.getAllUsers);

// Show edit user form
router.get('/edit/:id', userController.getEditUser);

// Handle user update
router.post('/edit/:id', userController.updateUser);

// Delete user
router.post('/delete/:id', userController.deleteUser);

// --- Student routes ---

// List all students
router.get('/students', userController.getAllStudents);

// Add new student
router.post('/students/add', userController.addStudent);

// Show edit student form
router.get('/students/edit/:id', userController.getEditStudent);

// Update student data
router.post('/students/edit/:id', userController.updateStudent);

// Delete student
router.post('/students/delete/:id', userController.deleteStudent);


module.exports = router;
