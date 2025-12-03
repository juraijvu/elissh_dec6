import sequelize from '../config/database.js';
import SEO from '../models/SEO.js';

const createSEOTable = async () => {
  try {
    console.log('🔧 Creating SEO table...');
    
    await SEO.sync({ force: true });
    
    console.log('✅ SEO table created successfully!');
  } catch (error) {
    console.error('❌ Error creating SEO table:', error);
    throw error;
  }
};

createSEOTable()
  .then(() => {
    console.log('SEO table setup completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('SEO table setup failed:', error);
    process.exit(1);
  });