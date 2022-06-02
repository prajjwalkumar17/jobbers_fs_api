const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jobModel = require('./../Models/jobModel');
const catchAsync = require('./catchAsync');
dotenv.config({ path: './config.env' });

//TODO read json
const jobToAdd = JSON.parse(
  fs.readFileSync(`${__dirname}/../Dev-Data/jobs.json`, 'utf-8')
);

//TODO connect DB

const DB = process.env.DB_LINK.replace('<password>', process.env.DB_PASSWORD);
mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB !!');
  }
);

//TODO Import data to db
const importData = catchAsync(async () => {
  await jobModel.create(jobToAdd, { validateBeforeSave: false });
  console.log('data added successfully');
  process.exit();
});

const deleteData = catchAsync(async () => {
  await jobModel.deleteMany();
  console.log('data deleted successfully');
  process.exit();
});

//TODO get input from terminal
if (process.argv[2] == '--import') importData();
else if (process.argv[2] == '--delete') deleteData();
console.log(process.argv);
