const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Landing page
router.get('/', (req, res) => {
  res.render('pages/landing');
});

// Signup routes
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

// Email verification
router.get('/verify-email', authController.verifyEmail);

// Login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

// Forgot password routes
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.forgotPassword);

// Reset password routes
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.resetPassword);

router.get('/admin/dashboard', authController.getAdminDashboard);
router.get('/user/dashboard', (req, res) => {
  res.render('user/dashboard');
});



module.exports = router;
