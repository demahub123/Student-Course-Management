// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const { User } = require('../models');
// require('dotenv').config();

// exports.signup = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     const existing = await User.findOne({ where: { email } });
//     if (existing) return res.status(400).json({ message: 'Email already in use' });

//     const hashed = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, password: hashed, role });

//     res.status(201).json({ message: 'User created', user: { id: user.id, name: user.name, role: user.role } });
//   } catch (err) {
//     res.status(500).json({ message: 'Signup error', error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ where: { email } });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     const match = await bcrypt.compare(password, user.password);
//     if (!match) return res.status(401).json({ message: 'Invalid password' });

//     const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: '2h'
//     });

//     res.json({
//       message: 'Login successful',
//       token,
//       user: { id: user.id, name: user.name, role: user.role }
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Login error', error: err.message });
//   }
// };


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User  = require('../models/user');
require('dotenv').config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });

    res.status(201).json({ message: 'User created', user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid password' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '2h'
    });

    // Role-based redirection logic
    if (user.role === 'admin') {
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, role: user.role },
        redirectUrl: 'adminDashboard' // or your admin dashboard route
      });
    } else if (user.role === 'student') {
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, role: user.role },
        redirectUrl: 'studentDashboard' // or your student dashboard route
      });
    } else {
      // fallback or default route
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, role: user.role },
        redirectUrl: '/' // default route
      });
    }
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err.message });
  }
};