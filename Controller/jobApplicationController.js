const JobsModel = require('../Models/jobModel');
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
  await JobsModel.findByIdAndUpdate(req.params.jobId, {
    $inc: { Total_Applicants: 1 },
  });
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
exports.getAppliedUsers = catchAsync(async (req, res, next) => {
  const data = await JobsModel.findById(req.params.jobId).populate(
    'Users_applied',
    // ['Role', '__v']
    ['-Jobs_applied']
  );
  //BUG don't want the Jobs_applied in output
  const usersApplied = data.Users_applied;
  usersApplied.forEach((el) => delete el.Jobs_applied);
  // console.log(usersApplied);
  if (usersApplied.length !== 0) {
    return res.status(300).json({
      status: 'Sucessfull',
      results: usersApplied.length,
      data: {
        usersApplied,
      },
    });
  } else
    return next(
      new AppError('No users applied yet we are waiting for applications', 404)
    );
});
exports.getMyAppliedJobs = catchAsync(async (req, res) => {
  const jobsApplied = req.user.Jobs_applied;
  res.status(300).json({
    status: 'Sucessfull',
    results: jobsApplied.length,
    data: {
      jobsApplied,
    },
  });
});
