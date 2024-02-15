const Trainer = require("./models/TrainerModel");
const transporter = require("./nodeMailer");
const {
  NewProjectAnnouncementTemplate,
  AdminAccessEmailTemplate,
  ForgotPasswordCodeEmailTemplate,
} = require("./emailTemplate");
require("dotenv").config();

const sendEmail = async (project) => {
  try {
    const trainers = await Trainer.findAll();
    for (let i = 0; i < trainers.length; i++) {
      await transporter.sendMail({
        from: `${process.env.email}`,
        to: trainers[i].email,
        subject: "New Project",
        html: NewProjectAnnouncementTemplate(project, trainers[i]),
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const generatePassword = () => {
  const length = 8;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+";

  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randomIndex);
  }

  return password;
};

const sendGeneratedPassword = async (trainer, newPassword, admin, giver) => {
  try {
    await transporter.sendMail({
      from: process.env.email,
      to: trainer.email,
      subject: "Your Account Has Been Successfully Approved",
      html: AdminAccessEmailTemplate(trainer, newPassword, admin, giver),
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
const sendRecoveryCode = async (email, user, code) => {
  try {
    await transporter.sendMail({
      from: `${process.env.email}`,
      to: email,
      subject: "Password Recovery Code",
      html: ForgotPasswordCodeEmailTemplate(user, code),
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  sendEmail,
  sendGeneratedPassword,
  generatePassword,
  sendRecoveryCode,
};
