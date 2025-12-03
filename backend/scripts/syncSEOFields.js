import sequelize from '../config/database.js';
import { Product, Category } from '../models/index.js';

const syncSEOFields = async () => {
  try {
    console.log('🔄 Syncing SEO fields to database...');
    
    // Sync Product model with new SEO fields
    await Product.sync({ alter: true });
    console.log('✅ Product SEO fields synced');
    
    // Sync Category model with new SEO fields  
    await Category.sync({ alter: true });
    console.log('✅ Category SEO fields synced');
    
    console.log('🎉 All SEO fields synced successfully!');
  } catch (error) {
    console.error('❌ Error syncing SEO fields:', error);
    throw error;
  }
};

syncSEOFields()
  .then(() => {
    console.log('SEO fields sync completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('SEO fields sync failed:', error);
    process.exit(1);
  });