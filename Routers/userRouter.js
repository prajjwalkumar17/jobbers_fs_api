const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
router.post('/signup', authController.signup);

router.get('/', authController.getAllUsers);
module.exports = router;
