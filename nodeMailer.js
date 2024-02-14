const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.email}`,
    pass: `${process.env.email_pass}`,
  },
});

module.exports = mailTransporter;
