const express = require('express');
const jobController = require('./../Controller/jobController');

const router = express.Router();
router.route('/').get(jobController.getAllJobs);
module.exports = router;
