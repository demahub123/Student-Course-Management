
const express = require('express');
const router = express.Router();
const authcontroller = ('../controllers/authController')

router.get('/', (req, res) => {
  res.render('landing'); // 
});

module.exports = router;
