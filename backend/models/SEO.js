import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const SEO = sequelize.define('SEO', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  page: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  keywords: {
    type: DataTypes.TEXT
  },
  ogTitle: {
    type: DataTypes.STRING
  },
  ogDescription: {
    type: DataTypes.TEXT
  },
  ogImage: {
    type: DataTypes.STRING
  },
  twitterTitle: {
    type: DataTypes.STRING
  },
  twitterDescription: {
    type: DataTypes.TEXT
  },
  twitterImage: {
    type: DataTypes.STRING
  },
  canonicalUrl: {
    type: DataTypes.STRING
  },
  robots: {
    type: DataTypes.STRING,
    defaultValue: 'index, follow'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'SEO'
});

export default SEO;