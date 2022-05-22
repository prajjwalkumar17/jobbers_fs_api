const express = require('express');
const morgan = require('morgan');
const jobRouter = require('./Routers/jobRouter.js');
const app = express();
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use('/api/v1/jobs', jobRouter);
module.exports = app;
