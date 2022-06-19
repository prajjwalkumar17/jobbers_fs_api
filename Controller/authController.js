const catchAsync = require('./../Utils/catchAsync');
const userModel = require('./../Models/userModel');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const AppError = require('./../Utils/appError');
const EmailSend = require('./../Utils/email');
const e = require('express');

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
  const url = '#';
  await new EmailSend(newUser, url).sendWelcome();
  return CreateAndSendToken(newUser, 201, res);
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
  return CreateAndSendToken(user, 200, res);
});
exports.forgotPassword = catchAsync(async (req, res, next) => {
  //search the user
  const user = await userModel.findOne({ Email: req.body.Email });
  if (!user)
    return next(
      new AppError('This email is not associated with any user', 404)
    );

  //generate the random token
  const resetToken = user.sendPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  //send token to user
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/auth/forgotPassword/${resetToken}`;
  await new EmailSend(user, resetUrl).sendPasswordResetToken(res);
});
exports.resetPassword = catchAsync(async (req, res, next) => {
  //get user based on token
  const resetTokenByuserEnc = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  const user = await userModel.findOne({
    Password_resetToken: resetTokenByuserEnc,
    Password_resetExpires: { $gt: Date.now() },
  });
  //check if time isn't expired
  if (!user) {
    return next(new AppError('Token is not valid or is laready expired', 400));
  }
  user.Password = req.body.Password;
  user.Password_confirm = req.body.Password_confirm;
  user.Password_resetToken = undefined;
  user.Password_resetExpires = undefined;
  await user.save();
  //lastupdated
  //send the jwt
  return CreateAndSendToken(user, 200, res);

  res.status(200).json({
    status: 'success',
    message: `${req.params.rt}`,
  });
});
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select('+Password');
  //check if password is correct or not
  if (!(await user.checkPassword(req.body.Password_current, user.Password)))
    return next(new AppError('Your current password is incorrect', 401));

  //update the password
  user.Password = req.body.Password;
  user.Password_confirm = req.body.Password_confirm;
  //findbyidUpdate won't work as specified as validators and pre middlewares won't work
  await user.save();
  //loguser in and send JWT
  CreateAndSendToken(user, 200, res);
});
