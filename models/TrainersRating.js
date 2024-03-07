const { DataTypes } = require("sequelize");
const { Sequelize } = require("sequelize");
const Trainer = require("../models/TrainerModel");
const Project = require("../models/ProjectModel");
require("dotenv").config();

const sequelize = new Sequelize(
  // `postgres://${process.env.DBuser}:${process.env.DBpassword}@${process.env.DBhost}:${process.env.DBport}/${process.env.DB}`
  process.env.connection_string

  // "postgres://postgres:password@localhost:5432/Trainers"
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
  ratingRationale: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

module.exports = TrainersRating;
