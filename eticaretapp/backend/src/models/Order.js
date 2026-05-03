const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending',
  },
  total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  address: { type: DataTypes.TEXT },
});

module.exports = Order;