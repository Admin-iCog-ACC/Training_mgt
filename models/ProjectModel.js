// models/projectModel.js
const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:password@localhost:5432/Trainers"
);

const Project = sequelize.define("Project", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  imageID: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  overview: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  endDate: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("On Hold", "In Progress", "Completed", "Not Started"),
    allowNull: false,
  },
  priority: {
    type: DataTypes.ENUM("High", "Low", "Intermediate"),
    allowNull: false,
  },
  budget: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  span: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Project;
