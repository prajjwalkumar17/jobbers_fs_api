const catchAsync = require('./../Utils/catchAsync');
exports.getAllUsers = catchAsync(async (req, res) => {
  res.status(200).json({ message: 'hii' });
});
