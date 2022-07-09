const express = require('express');
const AppError = require('./Utils/appError');
const GlobalAppError = require('./Utils//errorController');
const path = require('path');
const jobRouter = require('./Routers/jobRouter.js');
const authRouter = require('./Routers/authRouter.js');
const userRouter = require('./Routers/userRouter');
const cors = require('cors');
const app = express();
app.use(cors());
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(
  '/ProfilePics',
  express.static(path.join(__dirname, 'Uploads/ProfilePics'))
);
//TODO get req to https://jobbers-api.herokuapp.com/Resumes/user-Resume-62ac07341713075ea590cf6f-1655441227905.pdf
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
