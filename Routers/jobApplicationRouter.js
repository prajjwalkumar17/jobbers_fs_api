const express = require('express');
const apiFeatures = require('./../Utils/apiFeatures');
const jobApplicationController = require('./../Controller/jobApplicationController');
const router = express.Router({ mergeParams: true });
router
  .route('/')
  .post(
    apiFeatures.protect,
    apiFeatures.restrictTo('User'),
    jobApplicationController.Jobapply
  );
module.exports = router;
