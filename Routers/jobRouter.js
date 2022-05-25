const express = require('express');
const jobController = require('./../Controller/jobController');

const router = express.Router();
router.route('/').get(jobController.getAllJobs).post(jobController.postJobs);
router
  .route('/:id')
  .get(jobController.getOneJob)
  .delete(jobController.deleteOneJob)
  .patch(jobController.updateOneJob);
module.exports = router;
