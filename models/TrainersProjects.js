const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
const Trainer = require("../models/TrainerModel");
const Project = require("../models/ProjectModel");
const sequelize = new Sequelize(
  "postgres://postgres:password@localhost:5432/Trainers"
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
});

module.exports = TrainersProjects;
