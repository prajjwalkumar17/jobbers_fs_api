const catchAsync = require('./../Utils/catchAsync');
const jobModel = require('./../Models/jobModel');
exports.getAllJobs = catchAsync(async (req, res) => {
  return res.status(200).json({
    message: 'hey',
  });
});
exports.postJobs = catchAsync(async (req, res) => {
  const newCreatedJob = await jobModel.create(req.body);
  console.log(req.body);
  return res.status(201).json({
    status: 'sucess',
    data: { newCreatedJob },
  });
});
