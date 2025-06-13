const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/dashboard', async (req, res) => {
  try {
    const students = await db.any('SELECT * FROM students ORDER BY id DESC');
    res.render('admin/dashboard', { students: students });
  } catch (err) {
    console.error(err);
    res.send('Error loading dashboard');
  }
});

module.exports = router;
