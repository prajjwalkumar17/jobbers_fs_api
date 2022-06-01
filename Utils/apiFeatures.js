const AppError = require('./appError');
const jwt = require('jsonwebtoken');
const catchAsync = require('./catchAsync');
const { promisify } = require('util');
const userModel = require('../Models/userModel');

exports.protect = catchAsync(async (req, res, next) => {
  //TODO get token and check if its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  )
    token = req.headers.authorization.split(' ')[1];

  if (!token) return next(new AppError('No Token found', 401));
  //TODO validate the token
  let decodedPayload;
  decodedPayload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //TODO check if user still exists
  const currUser = await userModel.findById(decodedPayload.id);
  if (!currUser)
    return next(
      new AppError("The user belonging to this token doesn't exists", 401)
    );

  //TODO check if password was changed after the token was issued
  //   const passChanged = await currUser.changedPasswordAfter(decodedPayload.iat);
  //   if (passChanged)
  //     return next(
  //       new AppError('The Password was changed after the token was issued', 401)
  //     );
  //TODO Grant access to the protected routes
  req.user = currUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.Role)) {
      return next(new AppError('Not enough permissions', 403));
    }
    next();
  };
};
