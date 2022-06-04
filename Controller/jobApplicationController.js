const userModel = require('../Models/userModel');
const AppError = require('../Utils/appError');
const catchAsync = require('../Utils/catchAsync');

exports.Jobapply = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const jobId = req.params.jobId;
  let jobsAlreadyApplied = [];
  req.user.Jobs_applied.map((el) => {
    jobsAlreadyApplied.push(
      el._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')
    );
  });
  if (jobsAlreadyApplied.includes(jobId)) {
    return next(new AppError('Already Applied to this Job Opening', 409));
  }
  const Applyinguser = await userModel.findByIdAndUpdate(
    userId,
    {
      $push: { Jobs_applied: jobId },
    },
    {
      new: true,
    }
  );
  return res.status(200).json({
    status: 'sucess',
    data: {
      Applyinguser,
    },
  });
});
exports.getJobPostings = catchAsync(async (req, res) => {
  const data = await userModel.findById(req.user.id).populate('Jobs_created');
  const jobsCreated = data.Jobs_created;
  return res.status(200).json({
    status: 'Successfull',
    results: jobsCreated.length,
    Jobs_created: {
      jobsCreated,
    },
  });
});
