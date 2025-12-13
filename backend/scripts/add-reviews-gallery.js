import sequelize from '../config/database.js';
import { Review, UserGallery, Product } from '../models/index.js';

async function addReviewsAndGallery() {
  try {
    console.log('🔄 Adding reviews and gallery tables...');
    
    // Sync the new models
    await Review.sync({ alter: true });
    await UserGallery.sync({ alter: true });
    
    // Add new fields to Product table
    await sequelize.query(`
      ALTER TABLE "Products" 
      ADD COLUMN IF NOT EXISTS "avgRating" DECIMAL(2,1) DEFAULT 0,
      ADD COLUMN IF NOT EXISTS "reviewCount" INTEGER DEFAULT 0;
    `);
    
    console.log('✅ Reviews and gallery tables added successfully!');
    console.log('📊 Tables created:');
    console.log('   - Reviews (with admin approval)');
    console.log('   - UserGallery (user uploaded images)');
    console.log('   - Added avgRating and reviewCount to Products');
    
  } catch (error) {
    console.error('❌ Error adding reviews and gallery:', error);
  } finally {
    await sequelize.close();
  }
}

addReviewsAndGallery();