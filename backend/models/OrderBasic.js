import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Order = sequelize.define('Order', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled'),
    defaultValue: 'pending'
  },
  paymentMethod: {
    type: DataTypes.STRING,
    defaultValue: 'cod'
  },
  shippingAddress: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true
});

export default Order;