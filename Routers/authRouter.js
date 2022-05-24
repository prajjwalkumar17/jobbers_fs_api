const express = require('express');
const router = express.Router();
const authController = require('./../Controller/authController');
router.get('/', authController.getAllUsers);
module.exports = router;
