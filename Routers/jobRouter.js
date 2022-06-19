const express = require('express');
const jobController = require('./../Controller/jobController');
const apiFeatures = require('./../Utils/apiFeatures');
const jobApplicationRouter = require('./../Routers/jobApplicationRouter');
const jobApplicationController = require('./../Controller/jobApplicationController');

const router = express.Router();

router.use('/apply/:jobId', jobApplicationRouter);
router
  .route('/')
  .get(jobController.getAllJobs)
  .post(
    apiFeatures.protect,
    apiFeatures.restrictTo('Recruiter', 'Admin'),
    jobController.postJobs
  );

router
  .route('/bookmark/:jobid')
  .post(apiFeatures.protect, jobApplicationController.bookmarkAJob);
router
  .route('/myBookmarks')
  .get(apiFeatures.protect, jobApplicationController.getMyBookmarkedJobs);
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
