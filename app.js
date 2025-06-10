// File: app.js
const express = require('express');
const sequelize = require('./config/database'); // Your sequelize instance
const app = express();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');const courseRoutes = require('./routes/courseRoutes');
const studentRoutes = require('./routes/studentRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const path = require('path');
const indexRoutes = require('./routes/indexRoutes');



// For parsing URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true }));

// Optional: for parsing JSON data if needed elsewhere
app.use(express.json());

app.use(cors());
app.use(express.json());

// Set the view engine to EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
console.log('Views directory:', path.join(__dirname, 'views'));

// Serve login page
app.get('/login', (req, res) => {
  res.render('login'); // make sure views/login.ejs exists
});

app.get('/signup', (req, res) => {
  res.render('signup'); // make sure views/login.ejs exists
});


// Static files
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/', indexRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});
