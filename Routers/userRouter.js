const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getAUser);
module.exports = router;
