const express = require('express');
const apiFeatures = require('./../Utils/apiFeatures');
const jobApplicationController = require('./../Controller/jobApplicationController');
const router = express.Router({ mergeParams: true });
const upload = require('multer')();
// const upload = multer();
router.use(upload.array());
router
  .route('/')
  .get(
    apiFeatures.protect,
    apiFeatures.restrictTo('User'),
    jobApplicationController.Jobapply
  );
module.exports = router;
