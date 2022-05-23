const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utils/appError');
const GlobalAppError = require('./Utils//errorController');
const jobRouter = require('./Routers/jobRouter.js');
const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/auth', jobRouter);

app.use('*', (req, res, next) => {
  next(
    new AppError(
      `This ${req.originalUrl} url is currently not defined on this server`,
      404
    )
  );
  //   res.status(404).json({
  //     status: 'not found',
  //     message: `This ${req.originalUrl} url is currently not defined on this server`,
  //   });
});
app.use(GlobalAppError);
module.exports = app;
