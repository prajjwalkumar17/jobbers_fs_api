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
  const job = await JobsModel.findById(jobId);
  if (Date.now() < job.Application_deadline) {
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
  } else {
    job.active = false;
    await job.save({ validateBeforeSave: false });
    return next(new AppError('Applications are closed for this job', 404));
  }
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
    ['-Role', '-__v', '-Bookmarked_jobs']
    // ['-Jobs_applied']
  );
  //BUG don't want the Jobs_applied in output
  const usersApplied = data.Users_applied;
  // const result = usersApplied.map((el) => delete el.Jobs_applied);
  // console.log(result);
  if (usersApplied.length !== 0) {
    return res.status(200).json({
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
  const jobs = req.user.Jobs_applied;
  const jobsPromises = jobs.map(async (el) => await JobsModel.findById(el));
  const jobsApplied = await Promise.all(jobsPromises);
  // console.log(jobsApplied);
  res.status(200).json({
    status: 'Sucessfull',
    results: jobsApplied.length,
    data: {
      jobsApplied,
    },
  });
});
exports.bookmarkAJob = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const jobToBookmark = req.params.jobid;
  let alreadyBookmarked = [];
  req.user.Bookmarked_jobs.map((el) => {
    alreadyBookmarked.push(
      el._id.toString().replace(/ObjectId\("(.*)"\)/, '$1')
    );
  });
  if (alreadyBookmarked.includes(jobToBookmark))
    return next(new AppError('This job is already bookmarked', 409));

  const bookMarkingUser = await userModel.findByIdAndUpdate(
    userId,
    {
      $push: { Bookmarked_jobs: jobToBookmark },
    },
    {
      new: true,
    }
  );
  return res.status(200).json({
    status: 'sucess',
    data: {
      bookMarkingUser,
    },
  });
});
exports.getMyBookmarkedJobs = catchAsync(async (req, res, next) => {
  const bookmarkedJobs = req.user.Bookmarked_jobs;
  const bookmarkPromises = bookmarkedJobs.map(
    async (el) => await JobsModel.findById(el)
  );
  const bookmarks = await Promise.all(bookmarkPromises);
  return res.status(200).json({
    status: 'successfull',
    results: bookmarks.length,
    bookmarks,
  });
});
exports.getfeaturedJobs = catchAsync(async (req, res, next) => {
  const featuredJobs = await JobsModel.find({ Featured: { $eq: true } });
  if (featuredJobs.length >= 1)
    return res.status(200).json({
      status: 'successfull',
      results: featuredJobs.length,
      featuredJobs,
    });
  else return next(new AppError('No featured jobs as of now', 404));
});

exports.getRecommendedJobs = catchAsync(async (req, res, next) => {
  const userSkills = req.user.Skills;
  const recommendedJobs = await JobsModel.find({
    Skill_Requirement: { $in: userSkills },
  });
  if (recommendedJobs.length >= 1)
    return res.status(200).json({
      status: 'successfull',
      results: recommendedJobs.length,
      recommendedJobs,
    });
  else
    return next(
      new AppError('No Recommended jobs as of now update your skills', 404)
    );
});
