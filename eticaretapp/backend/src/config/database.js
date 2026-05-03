const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './eticaret.db',
  logging: false,
});

module.exports = sequelize;