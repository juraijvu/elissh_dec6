import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Category = sequelize.define('Category', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  },
  image: {
    type: DataTypes.TEXT
  },
  parentId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Categories',
      key: 'id'
    }
  },

  slug: {
    type: DataTypes.STRING,
    unique: true
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sortOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  // SEO Fields (comprehensive)
  metaTitle: {
    type: DataTypes.STRING(60)
  },
  metaDescription: {
    type: DataTypes.STRING(155)
  },
  h1Tag: {
    type: DataTypes.STRING
  },
  primaryKeyword: {
    type: DataTypes.STRING
  },
  focusKeyword: {
    type: DataTypes.STRING
  },
  seoKeywords: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  seoContent: {
    type: DataTypes.TEXT
  },
  altText: {
    type: DataTypes.STRING
  },
  canonicalUrl: {
    type: DataTypes.STRING
  },
  seoScore: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0.8
  },
  noIndex: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  noFollow: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  enableSchema: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  ogTitle: {
    type: DataTypes.STRING(60)
  },
  ogDescription: {
    type: DataTypes.STRING(155)
  },
  twitterTitle: {
    type: DataTypes.STRING(60)
  },
  twitterDescription: {
    type: DataTypes.STRING(155)
  },
  structuredData: {
    type: DataTypes.JSON,
    defaultValue: {}
  },
  productCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: (category) => {
      if (category.name && !category.slug) {
        category.slug = category.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
      }
    },
    beforeUpdate: (category) => {
      if (category.changed('name')) {
        category.slug = category.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
      }
    }
  }
});

Category.hasMany(Category, { as: 'children', foreignKey: 'parentId' });
Category.belongsTo(Category, { as: 'parent', foreignKey: 'parentId' });

export default Category;