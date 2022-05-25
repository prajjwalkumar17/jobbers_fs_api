const catchAsync = require('./../Utils/catchAsync');
const jobModel = require('./../Models/jobModel');
exports.getAllJobs = catchAsync(async (req, res) => {
  const allJobs = await jobModel.find();
  return res.status(200).json({
    status: 'sucess',
    results: allJobs.length,
    data: { allJobs },
  });
});
exports.postJobs = catchAsync(async (req, res) => {
  const newCreatedJob = await jobModel.create(req.body);
  return res.status(201).json({
    status: 'sucess',
    data: { newCreatedJob },
  });
});
exports.getOneJob = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = await jobModel.findById(id);
  return res.status(201).json({
    status: 'sucess',
    data: { data },
  });
});
exports.deleteOneJob = catchAsync(async (req, res) => {
  await jobModel.findByIdAndDelete(req.params.id);
  return res.status(201).json({
    status: 'sucess',
    data: {},
  });
});
exports.updateOneJob = catchAsync(async (req, res) => {
  const updatedJob = await jobModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  return res.status(201).json({
    status: 'sucess',
    data: {
      updatedJob,
    },
  });
});
