const catchAsync = require('./../Utils/catchAsync');
const jobModel = require('./../Models/jobModel');
const handler = require('./../Controller/handler');
const fs = require('fs');
exports.getAllJobs = catchAsync(async (req, res) => {
  let allJobs = fs.readFileSync('./jobs.json', 'utf-8');
  let jobs = JSON.parse(allJobs);
  console.log(jobs);
  console.log(jobs.length);
  // const allJobs = await jobModel.find({ active: { $ne: false } });
  return res.status(200).json({
    status: 'sucess',
    results: jobs.length,
    data: { jobs },
  });
});
exports.postJobs = catchAsync(async (req, res) => {
  // req.body.Posted_by = req.user.id;
  // const newCreatedJob = await jobModel.create(req.body);
  const newCreatedJob = req.body;
  console.log(newCreatedJob);
  let jobsPresent = fs.readFileSync('./jobs.json', 'utf-8');
  let jobs = JSON.parse(jobsPresent);
  jobs.push(newCreatedJob);
  jobsPresent = JSON.stringify(jobs, null, 2);
  fs.writeFile(`./jobs.json`, jobsPresent, (err) => {
    if (err) console.log(err);
    else {
      console.log('Successfully written');
    }
  });
  return res.status(201).json({
    status: 'sucess',
    data: { newCreatedJob },
  });
});
exports.getOneJob = catchAsync(async (req, res) => {
  const id = req.params.id;
  const data = await jobModel.findById(id);
  return res.status(201).json({
    status: 'sucess',
    data: { data },
  });
});
exports.deleteOneJob = handler.deleteOne(jobModel);

exports.updateOneJob = handler.updateOne(jobModel);
