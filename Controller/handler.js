const catchAsync = require('../Utils/catchAsync');

exports.getAll = (model) => catchAsync(async (req, res, next) => {});
exports.getOne = (model) =>
  catchAsync(async (req, res) => {
    const data = await model.findById(req.params.id);
    return res.status(201).json({
      status: 'sucess',
      data: { data },
    });
  });
exports.updateOne = (model) =>
  catchAsync(async (req, res, next) => {
    const updatedDoc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    return res.status(202).json({
      status: 'sucess',
      data: {
        updatedDoc,
      },
    });
  });
exports.deleteOne = (model) =>
  catchAsync(async (req, res, next) => {
    await model.findByIdAndDelete(req.params.id);
    return res.status(201).json({
      status: 'sucess',
      data: {},
    });
  });
