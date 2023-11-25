require('dotenv').config();
const {Sequelize, DataTypes} = require("sequelize");

var initModels = require("./init-models");

const sequelize = new Sequelize(process.env.DB_NAME, process.env.USER, process.env.PASSWORD, {
  host: process.env.HOST,
  port: process.env.PORT,
  dialect: 'mysql',
  define: {
      freezeTableName: true,
  },
});


var models = initModels(sequelize);

module.exports = models;