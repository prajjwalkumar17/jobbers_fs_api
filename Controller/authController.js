const catchAsync = require('./../Utils/catchAsync');
const userModel = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
exports.getAllUsers = catchAsync(async (req, res) => {
  const users = await userModel.find();
  res.status(200).json({
    results: users.length,
    data: {
      users,
    },
  });
});
const TokenSigner = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.EXPIRES_IN,
  });
};
const CreateAndSendToken = (user, statusCode, res) => {
  const token = TokenSigner(user._id);

  user.__v = undefined;
  res.status(statusCode).json({
    token,
    data: {
      user,
    },
  });
};
exports.signup = catchAsync(async (req, res) => {
  const newUser = await userModel.create(req.body);
  CreateAndSendToken(newUser, 201, res);
});
