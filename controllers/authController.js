const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const saltRounds = 10;

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Render Login Page
exports.getLogin = (req, res) => {
  res.render('pages/login', { message: null });
};

// Handle Login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      return res.redirect('/admin/dashboard');
    }

    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      return res.render('pages/login', { message: 'Invalid credentials!' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      return res.render('pages/login', { message: 'Please verify your email first.' });
    }

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('pages/login', { message: 'Invalid credentials!' });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true });

    return res.redirect('/user/dashboard');
  } catch (error) {
    console.error(error);
    res.render('pages/login', { message: 'Something went wrong. Please try again.' });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.clearCookie('jwt');
    res.redirect('/login');
  });
};

// Admin Dashboard (contacts temporarily disabled)
// At top, add Student model import or DB query utility if needed
// Assuming you use pg-promise or similar via your db object

exports.getAdminDashboard = async (req, res) => {
  try {
    // Fetch all students - adjust the table name and columns as per your schema
    const students = await db.any('SELECT * FROM students');

    // Render the dashboard and pass students data
    res.render('admin/dashboard', {
      students,     // students data here
      contacts: [], // keep existing placeholders or remove if unused
      contact: null,
      message: null
    });
  } catch (err) {
    console.error('❌ Error loading dashboard:', err);
    res.status(500).send('Server Error');
  }
};


// Render Signup Page
exports.getSignup = (req, res) => {
  res.render('pages/signup', { message: null });
};

// Handle Signup
exports.postSignup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  try {
    // Check passwords match
    if (password !== confirmPassword) {
      return res.render('pages/signup', { message: 'Passwords do not match!' });
    }

    const existingUser = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser) {
      return res.render('pages/signup', { message: 'Email already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await db.none(
      `INSERT INTO users (name, email, password, verification_token, is_verified)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, email, hashedPassword, verificationToken, false]
    );

    const verificationLink = `http://localhost:${process.env.PORT}/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Sherubtse Auth" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Verify your email',
      html: `<h3>Hello ${name},</h3><p>Please verify your email by clicking the link below:</p><a href="${verificationLink}">Verify Email</a>`,
    });

    res.render('pages/signup', { message: 'Signup successful! Check your email to verify.' });
  } catch (error) {
    console.error(error);
    res.render('pages/signup', { message: 'Error during signup.' });
  }
};

// Email Verification
exports.verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    await db.none('UPDATE users SET is_verified = true, verification_token = null WHERE email = $1', [email]);

    res.send('✅ Email verified successfully. You can now log in.');
  } catch (error) {
    res.send('❌ Invalid or expired verification link.');
  }
};

// Forgot Password Page
exports.getForgotPassword = (req, res) => {
  res.render('pages/forgot-password', { message: null });
};

// Handle Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [email]);
    if (!user) {
      return res.render('pages/forgot-password', { message: 'Email not found' });
    }

    const resetToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    await db.none('UPDATE users SET reset_token = $1 WHERE email = $2', [resetToken, email]);

    const resetLink = `${process.env.BASE_URL}/reset-password?token=${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click the link below to reset your password:\n\n${resetLink}`,
    });

    res.render('pages/forgot-password', { message: 'Password reset link has been sent to your email.' });

  } catch (error) {
    console.error(error);
    res.render('pages/forgot-password', { message: 'Something went wrong. Please try again.' });
  }
};

// Reset Password Page
exports.getResetPassword = (req, res) => {
  const { token } = req.query;
  res.render('pages/reset-password', { token, message: null });
};

// Handle Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.oneOrNone('SELECT * FROM users WHERE email = $1', [decoded.email]);

    if (!user) {
      return res.render('pages/reset-password', { message: 'Invalid or expired token', token });
    }

    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    await db.none('UPDATE users SET password = $1, reset_token = NULL WHERE email = $2', [hashedPassword, decoded.email]);

    res.render('pages/reset-password', { message: 'Password has been reset successfully.', token });
  } catch (error) {
    console.error(error);
    res.render('pages/reset-password', { message: 'Invalid or expired token', token });
  }
};
