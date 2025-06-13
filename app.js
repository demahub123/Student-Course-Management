const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();
const bodyParser = require('body-parser');
const db = require('./config/db');

// Database table creation functions
const { createUserTable } = require('./models/userModel');
const { createCourseTable } = require('./models/courseModel');

// Routers
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const dashboardRoutes = require('./routes/userRoutes');  // This is same as userRoutes
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------- MIDDLEWARE ---------------- //

// Parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Parse application/json
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Parse application/x-www-form-urlencoded (again for safety)
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files (css, js, images) from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'secretkey',
  resave: false,
  saveUninitialized: true,
}));

// ---------------- VIEW ENGINE ---------------- //

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------------- ROUTES ---------------- //

// Auth routes
app.use('/', authRoutes);

// User dashboard routes
app.use('/user', userRoutes);
app.use('/dashboard', userRoutes);  // technically same as /user

// Admin routes
app.use('/admin', adminRoutes);

// Direct render for signup page (optional)
app.get('/signup', (req, res) => {
  res.render('pages/signup');
});

// ---------------- DATABASE TABLE CREATION ---------------- //

createUserTable();
createCourseTable();

// ---------------- START SERVER ---------------- //

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
