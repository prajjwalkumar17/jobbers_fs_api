const userModel = require('../Models/userModel');
const catchAsync = require('../Utils/catchAsync');
const handler = require('./../Controller/handler');
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
exports.createUser = (req, res, next) => {
  return next(new AppError("This route isn't defined login can be used", 500));
};
exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await userModel.findByIdAndUpdate(req.user.id, { active: false });
  return next(
    res.status(200).json({
      status: 'sucess',
      message: `The user is sucessfully deleted`,
    })
  );
});
//TODO photo Upload
const multer = require('multer');
const upload = multer({ dest: 'Uploads/ProfilePics' });
exports.uploadProfilePic = upload.single('Photo');
exports.updateMe = catchAsync(async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  res.status(200).json({
    status: 'sucess',
    message: `The user is sucessfully updated`,
  });
});
exports.getAUser = handler.getOne(userModel);
exports.deleteAUser = handler.deleteOne(userModel);
exports.updateAUser = handler.updateOne(userModel);
