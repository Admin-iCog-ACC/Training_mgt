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
    type: DataTypes.ENUM("In Progress", "Completed"),
    allowNull: false,
    defaultValue: "In Progress",
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
  days: {
    type: DataTypes.ARRAY(DataTypes.JSON),
    defaultValue: [],
  },
});

module.exports = Project;
