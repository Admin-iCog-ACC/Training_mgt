const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
const Trainer = require("../models/TrainerModel");
const Project = require("../models/ProjectModel");
const sequelize = new Sequelize(
  "postgres://postgres:password@localhost:5432/Trainers"
);
const TrainersRating = sequelize.define("TrainersRating", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  rating: {
    type: DataTypes.SMALLINT,
    allowNull: false,
  },
});

module.exports = TrainersRating;
