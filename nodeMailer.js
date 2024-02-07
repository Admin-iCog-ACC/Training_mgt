const nodemailer = require("nodemailer");

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "tessemayenoh94@gmail.com",
    pass: "xjsnslazvmgapiti",
  },
});

let mailDetails = {
  from: "xyz@gmail.com",
  to: "abc@gmail.com",
  subject: "Test mail",
  text: "Node.js testing mail for GeeksforGeeks",
};

module.exports = mailTransporter;
