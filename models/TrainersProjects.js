const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
const Trainer = require("../models/TrainerModel");
const Project = require("../models/ProjectModel");
require("dotenv").config();

const sequelize = new Sequelize(
  // process.env.connection_string
  `postgres://${process.env.DBuser}:${process.env.DBpassword}@${process.env.DBhost}:${process.env.DBport}/${process.env.DB}`

  // "postgres://postgres:password@localhost:5432/Trainers"
);
const TrainersProjects = sequelize.define("TrainersProjects", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM("Accepted", "Rejected", "In Progress", "Done"),
    allowNull: false,
    defaultValue: "In Progress",
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
  statusRationale: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
});

module.exports = TrainersProjects;
