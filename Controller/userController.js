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
exports.createUser = (_, __, next) => {
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
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'Photo') {
      cb(null, 'Uploads/ProfilePics');
    } else if (file.fieldname === 'Resume') {
      cb(null, 'Uploads/Resumes');
    }
  },
  filename: (req, file, cb) => {
    if (file.fieldname === 'Resume') {
      req.cv = file;
      const ext = file.mimetype.split('/')[1];
      const resname = `user-Resume-${req.user.id}-${Date.now()}.${ext}`;
      req.cv.modifiedname = resname;
      cb(null, resname);
    } else if (file.fieldname === 'Photo') {
      req.dp = file;
      const ext = file.mimetype.split('/')[1];
      const dpname = `user-ProfilePic-${req.user.id}-${Date.now()}.${ext}`;
      req.dp.modifiedname = dpname;
      cb(null, dpname);
    }
  },
});
const multerFilter = (req, file, cb) => {
  if (file.fieldname === 'Resume') {
    if (
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // check file type to be pdf, doc, or docx
      cb(null, true);
    } else {
      cb('Should only select a PDF,doc or docx file', false); // else fails
    }
  } else if (file.fieldname === 'Photo') {
    if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
    ) {
      // check file type to be png, jpeg, or jpg
      cb(null, true);
    } else {
      cb('Select only a png, jpg or a jpeg pic', false); // else fails
    }
  }
};
const uploadResources = multer({
  storage: multerStorage,
  // limits: {
  //   fileSize: 1048576,
  // },
  fileFilter: multerFilter,
});
exports.uploads = uploadResources.fields([
  {
    name: 'Photo',
    maxCount: 1,
  },
  {
    name: 'Resume',
    maxCount: 1,
  },
]);
const filterOut = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.cv);
  //TODO create error if password is added in body
  // console.log(req.body.Skills);
  if (req.body.Password || req.body.Password_confirm)
    return next(new AppError('This route is not for updating password', 400));

  //TODO create filter body
  const filteredBody = filterOut(
    req.body,
    'Name',
    'Email',
    'Skills',
    'Current_designation'
  );
  if (req.cv) filteredBody.Resume = req.cv.modifiedname;
  if (req.dp) filteredBody.Photo = req.dp.modifiedname;
  if (req.body.Skills) filteredBody.Skills = req.body.Skills;

  const updatedMe = await userModel.findByIdAndUpdate(
    req.user.id,
    filteredBody,
    {
      new: true,
    }
  );
  return res.status(200).json({
    status: 'sucess',
    message: `The user is sucessfully updated`,
    updatedMe,
  });
});
exports.getAUser = handler.getOne(userModel);
exports.deleteAUser = handler.deleteOne(userModel);
exports.updateAUser = handler.updateOne(userModel);
