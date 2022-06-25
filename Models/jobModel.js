const mongoose = require('mongoose');
const catchAsync = require('../Utils/catchAsync');
const schema = new mongoose.Schema({
  Company_name: {
    type: String,
    required: [true, 'A job must have a name'],
    trim: true,
    immutable: [false, "A company name can't change"],
  },
  About_company: String,
  Job_role: {
    type: String,
    required: [true, 'A job must have a Role specified'],
  },
  Job_type: {
    type: String,
    enum: ['Internship', 'Full-time', 'Part-time', 'Freelancing'],
    required: [true, 'A job Must have a type '],
  },
  Duration: {
    type: String,
    default: 'flexible',
  },
  Posted_by: {
    type: mongoose.Schema.ObjectId,
    ref: 'Users',
    required: [true, 'Posted By should be there'],
  },
  Application_deadline: {
    type: Date,
    required: [true, 'A deadline must be there'],
  },
  Location: {
    type: String,
    required: [true, 'A job must have a Location specified'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  Job_description: {
    type: String,
    required: [true, 'A job must have a Description given'],
  },
  Salary: {
    type: String,
    default: 'unspecified',
  },
  Skill_Requirement: {
    type: Array,
    default: [],
  },
  Responsibilities: String,
  Experience_required: Number,
  Openings_available: {
    type: Number,
    required: [true, 'A job must have a certain no of openings avilable'],
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  Featured: Boolean,
  Total_Applicants: {
    type: Number,
    default: 0,
  },
  Perks: String,
});
schema.virtual('Users_applied', {
  ref: 'Users',
  localField: '_id',
  foreignField: 'Jobs_applied',
});
//BUG will create problem for recuiters after deadlines they can't get the applicants so implemented this in get job route
// schema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } });
//   next();
// });
const JobsModel = mongoose.model('Jobs', schema);
module.exports = JobsModel;
