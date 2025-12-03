import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Banner = sequelize.define('Banner', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  image: {
    type: DataTypes.TEXT
  },
  link: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true
});

export default Banner;