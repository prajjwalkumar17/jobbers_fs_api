const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const userController = require('../Controller/userController');
router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.get('/', userController.getAllUsers);
module.exports = router;
