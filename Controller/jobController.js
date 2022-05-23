const catchAsync = require('./../Utils/catchAsync');
exports.getAllJobs = catchAsync(async (req, res) => {
  return res.status(200).json({
    message: 'hey',
  });
});
