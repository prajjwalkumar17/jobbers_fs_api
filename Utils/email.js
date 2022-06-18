const nodemailer = require('nodemailer');
const pug = require('pug');
const html2text = require('html-to-text');

module.exports = class EmailSend {
  constructor(user, url) {
    this.to = user.Email;
    this.firstName = user.Name.split(' ')[0];
    this.url = url;
    this.from = process.env.Email;
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //send grid
      return nodemailer.createTransport({
        host: process.env.SENDINBLUE_DOMAIN,
        port: process.env.SENDINBLUE_PORT,
        auth: {
          user: process.env.SENDINBLUE_USERNAME,
          pass: process.env.SENDINBLUE_PASS,
        },
      });
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
  async send(template, subject) {
    //1)render pug
    const html = pug.renderFile(
      `${__dirname}/../Views/Emails/${template}.pug`,
      {
        firstName: this.firstName,
        url: this.url,
        subject,
      }
    );
    //2)define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: html2text.fromString(html),
    };
    //3)Create and send emails
    await this.newTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.send('Welcome', 'Welcome to Jobbers Platform!');
  }
};
