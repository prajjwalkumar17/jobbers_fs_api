const catchAsync = require('../Utils/catchAsync');

exports.getAll = (model) => catchAsync(async (req, res, next) => {});
exports.getOne = (model) => catchAsync(async (req, res, next) => {});
exports.updateOne = (model) => catchAsync(async (req, res, next) => {});
exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    await model.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      status: 'sucess',
      data: {},
    });
  });
