// models/projectModel.js
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:password@localhost:5432/Trainers"
);
const Trainer = sequelize.define("Trainer", {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM("Male", "Female"),
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  AreaofExpertise: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  CvURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  CVId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  experienceLevel: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bio: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  profileImageId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  recoveryDigits: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  time: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  rating: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
});

module.exports = Trainer;
