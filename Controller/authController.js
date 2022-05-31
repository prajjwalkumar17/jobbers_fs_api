const catchAsync = require('./../Utils/catchAsync');
const userModel = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../Utils/appError');
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
exports.signup = catchAsync(async (req, res, next) => {
  //TODO check if user already exists
  const Email = req.body.Email;
  const oldUser = await userModel.findOne({ Email });
  if (oldUser)
    return next(new AppError('User already exists proceed for login', 409));
  const newUser = await userModel.create(req.body);
  CreateAndSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { Email, Password } = req.body;
  //TODO check if email and passwords are filled in
  if (!Email || !Password)
    return next(
      new AppError('Please enter Email and Password to proceed', 400)
    );
  //TODO check if they are correct
  const user = await userModel.findOne({ Email }).select('+Password');
  if (!user || !(await user.loginPasswordChecker(Password, user.Password))) {
    return next(new AppError('Incorrect user or Password', 400));
  }
  //TODO if all true then send jwt
  CreateAndSendToken(user, 200, res);
});
