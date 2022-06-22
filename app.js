const express = require('express');
const AppError = require('./Utils/appError');
const GlobalAppError = require('./Utils//errorController');
const path = require('path');
const jobRouter = require('./Routers/jobRouter.js');
const authRouter = require('./Routers/authRouter.js');
const userRouter = require('./Routers/userRouter');
const app = express();
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(
  '/ProfilePics',
  express.static(path.join(__dirname, 'Uploads/ProfilePics'))
);
app.use('/Resumes', express.static(path.join(__dirname, 'Uploads/Resumes')));
app.use(express.json({ limit: '10kb' }));
app.use('/api/v1/jobs', jobRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);

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
