const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
const Trainer = require("../models/TrainerModel");
const Project = require("../models/ProjectModel");
const sequelize = new Sequelize(
  "postgres://postgres:password@localhost:5432/Trainers"
);
const TrainersProjects = sequelize.define("TrainersProjects", {
  TrainerId: {
    type: DataTypes.INTEGER,
    references: {
      model: Trainer,
      key: "id",
    },
  },
  ProjectId: {
    type: DataTypes.INTEGER,
    references: {
      model: Project,
      key: "id",
    },
  },
});

module.exports = TrainersProjects;
