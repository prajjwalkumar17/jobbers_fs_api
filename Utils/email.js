const nodemailer = require('nodemailer');
const pug = require('pug');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.Email;
    this.firstName = user.Name.split(' ')[0];
    this.url = url;
    this.from = process.env.Email;
  }
  createTransport() {
    if (process.env.NODE_ENV === 'production') {
      //send grid
      return 1;
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  send(template, subject) {
    //1)render pug
    //2)define email options
    //3)Create and send emails
  }
  sendWelcome() {
    this.send('Welcome', 'Welcome to Jobbers Platform!');
  }
};
