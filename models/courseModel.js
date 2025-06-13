const db = require('../config/db');

const createCourseTable = async () => {
  try {
    await db.none(`
        CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        year INT NOT NULL,
        course VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

    `);
    console.log("✅ course table ensured.");
  } catch (err) {
    console.error("❌ Error creating course table:", err);
  }
};

module.exports = {
  createCourseTable
};
