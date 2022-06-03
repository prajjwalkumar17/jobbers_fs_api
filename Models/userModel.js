// skill resume latest education(institution,course/degreename,startyear,endyear)
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const catchAsync = require('../Utils/catchAsync');
const jobModel = require('./../Models/jobModel');

const userSchema = new mongoose.Schema({
  Name: {
    type: String,
    Required: [true, 'A candidate must have a name'],
  },
  Email: {
    type: String,
    trim: true,
    validate: [validator.isEmail, 'Please cross-check the provided email once'],
    unique: [true, 'This email is already registered, Please signIn'],
    lowercase: true,
  },
  Password: {
    type: String,
    required: [true, 'A min of 8 length password is required for sisgnUp'],
    minlength: 8,
    select: false,
  },
  Photo: {
    type: String,
  },
  Role: {
    type: String,
    enum: ['Recruiter', 'User', 'Admin'],
    required: [true, 'A person must be a Recruiter or a Job-seeker'],
  },
  Password_confirm: {
    type: String,
    validate: {
      validator: function (el) {
        return el === this.Password;
      },
      message: "Passwords don't match",
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  Jobs_applied: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Jobs',
    },
  ],
  // Jobs_applied: Array,
});
userSchema.pre('save', async function (next) {
  if (!this.isModified('Password')) return next();
  this.Password = await bcrypt.hash(this.Password, 12);
  this.Password_confirm = undefined;
  next();
});
//TODO Embedding
// userSchema.pre('save', async function (next) {
//   const jobsPromises = this.Jobs_applied.map(
//     async (id) => await jobModel.findById(id)
//   );
//   this.Jobs_applied = await Promise.all(jobsPromises);
//   next();
// });
//TODO Referencong
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'Jobs_applied',
  });
  next();
});
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.methods.loginPasswordChecker = async function (
  enteredPassword,
  passwordinDb
) {
  return await bcrypt.compare(enteredPassword, passwordinDb);
};

const userModel = new mongoose.model('Users', userSchema);
module.exports = userModel;
