const db = require('../config/db');

// --- User functions ---

// List all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await db.any('SELECT id, name, email FROM users ORDER BY id');
    res.render('user/dashboard', { users });  // Render users in dashboard.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Get user edit form
exports.getEditUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.one('SELECT * FROM users WHERE id = $1', [id]);
    res.render('user/edit-user', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Update user data
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    await db.none('UPDATE users SET name = $1, email = $2 WHERE id = $3', [name, email, id]);
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.none('DELETE FROM users WHERE id = $1', [id]);
    res.redirect('/user');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// --- Student functions ---

// List all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await db.any('SELECT * FROM students ORDER BY id');
    res.render('user/students', { students });  // Render students in students.ejs
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Add new student
exports.addStudent = async (req, res) => {
  const { name, student_id, year, course } = req.body;
  try {
    await db.none(
      'INSERT INTO students (name, student_id, year, course) VALUES ($1, $2, $3, $4)',
      [name, student_id, year, course]
    );
    res.redirect('/user/students');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Get student edit form
exports.getEditStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await db.one('SELECT * FROM students WHERE id = $1', [id]);
    res.render('user/edit-student', { student });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Update student
exports.updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, student_id, year, course } = req.body;
  try {
    await db.none(
      'UPDATE students SET name = $1, student_id = $2, year = $3, course = $4 WHERE id = $5',
      [name, student_id, year, course, id]
    );
    res.redirect('/user/students');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Delete student
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    await db.none('DELETE FROM students WHERE id = $1', [id]);
    res.redirect('/user/students');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

// Add new user
exports.addUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    await db.none(
      'INSERT INTO users (name, email) VALUES ($1, $2)',
      [name, email]
    );
    res.redirect('/user'); // Redirect to user list page after adding
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};
