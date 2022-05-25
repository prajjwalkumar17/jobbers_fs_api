const express = require('express');
const morgan = require('morgan');
const AppError = require('./Utils/appError');
const GlobalAppError = require('./Utils//errorController');
const jobRouter = require('./Routers/jobRouter.js');
const userRouter = require('./Routers/userRouter');
const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/auth', userRouter);

app.use('*', (req, res, next) => {
  next(
    new AppError(
      `This ${req.originalUrl} url is currently not defined on this server`,
      404
    )
  );
});
app.use(GlobalAppError);
module.exports = app;
