const express = require('express');
const router = express.Router();
const authController = require('../Controller/authController');
const apiFeatures = require('../Utils/apiFeatures');
const upload = require('multer')();
// // const upload = multer();
router.use(upload.array());
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/forgotPassword', authController.forgotPassword);
router.patch('/forgotPassword/:resetToken', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  apiFeatures.protect,
  authController.updatePassword
);

module.exports = router;
