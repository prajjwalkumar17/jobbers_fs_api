const express = require('express');
const router = express.Router();
const userController = require('../Controller/userController');
const apiFeatures = require('../Utils/apiFeatures');

router.get('/', userController.getAllUsers);
router.get(
  '/me',
  apiFeatures.protect,
  userController.getMe,
  userController.getAUser
);
router.delete('/deleteMe', apiFeatures.protect, userController.deleteMe);
router.post('/', userController.createUser);
router.get('/:id', userController.getAUser);
module.exports = router;
