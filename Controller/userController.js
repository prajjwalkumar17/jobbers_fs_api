const userModel = require('../Models/userModel');
const catchAsync = require('../Utils/catchAsync');
const handler = require('./../Controller/handler');

exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getAUser = handler.getOne(userModel);
