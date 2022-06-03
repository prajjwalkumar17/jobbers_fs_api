const express = require('express');
const jobController = require('./../Controller/jobController');
const apiFeatures = require('./../Utils/apiFeatures');

const router = express.Router();

router
  .route('/')
  .get(jobController.getAllJobs)
  .post(
    apiFeatures.protect,
    apiFeatures.restrictTo('Admin'),
    jobController.postJobs
  );

router
  .route('/:id')
  .get(
    apiFeatures.protect,
    apiFeatures.restrictTo('Admin'),
    jobController.getOneJob
  )
  .delete(jobController.deleteOneJob)
  .patch(jobController.updateOneJob);
module.exports = router;
