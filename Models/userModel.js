// skill resume latest education(institution,course/degreename,startyear,endyear)
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

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
  Resume: {
    type: String,
  },
  Role: {
    type: String,
    enum: ['Recruiter', 'User', 'Admin'],
    required: [true, 'A person must be a Recruiter or a Job-seeker'],
  },
  Current_designation: String,
  Skills: {
    type: Array,
    default: [],
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
      unique: [true, 'Already Applied to this job'],
    },
  ],
  Bookmarked_jobs: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Jobs',
      unique: [true, "can't bookmarked a job 2 times"],
    },
  ],
  Password_resetToken: String,
  Password_resetExpires: Date,
  Password_LastChangedAt: Date,
  // Jobs_applied: Array,
});
//TODO virtual populate to get parent from the parent referencing
userSchema.virtual('Jobs_created', {
  ref: 'Jobs',
  foreignField: 'Posted_by',
  localField: '_id',
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
//TODO Referencing
// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'Jobs_applied',
//   });
//   next();
// });
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
userSchema.pre('save', function (next) {
  //returns when password is not modified or if the doc is new
  if (!this.isModified('Password') || this.isNew) return next();
  this.Password_LastChangedAt = Date.now() - 1000;
  next();
});
userSchema.methods.loginPasswordChecker = async function (
  enteredPassword,
  passwordinDb
) {
  return await bcrypt.compare(enteredPassword, passwordinDb);
};
userSchema.methods.sendPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.Password_resetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log(
    `for verification ${resetToken} : for saving to the database ${this.Password_resetToken}`
  );
  this.Password_resetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
userSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
const userModel = new mongoose.model('Users', userSchema);
module.exports = userModel;
