import sequelize from '../config/database.js';
import User from '../models/User.js';
import Category from '../models/CategoryBasic.js';
import Product from '../models/ProductBasic.js';
import SEO from '../models/SEOBasic.js';
import bcrypt from 'bcryptjs';

const fixProduction = async () => {
  try {
    console.log('🚀 Fixing production issues...');
    
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Database synced');
    
    // Fix admin user
    let admin = await User.findOne({ where: { email: 'admin@elisshbeauty.ae' } });
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      admin = await User.create({
        name: 'Admin User',
        firstName: 'Admin',
        lastName: 'User',
        email: 'admin@elisshbeauty.ae',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      });
      console.log('✅ Admin user created');
    } else {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      await admin.update({ password: hashedPassword });
      console.log('✅ Admin password updated');
    }
    
    // Create basic categories if none exist
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      const categories = [
        { name: 'Skincare', description: 'Skincare products', slug: 'skincare' },
        { name: 'Makeup', description: 'Makeup products', slug: 'makeup' },
        { name: 'Haircare', description: 'Hair care products', slug: 'haircare' },
        { name: 'Fragrance', description: 'Perfumes and fragrances', slug: 'fragrance' }
      ];
      
      for (const cat of categories) {
        await Category.create(cat);
      }
      console.log('✅ Categories created');
    }
    
    // Create SEO data if none exists
    const seoCount = await SEO.count();
    if (seoCount === 0) {
      const seoPages = [
        { page: 'home', title: 'Elissh Beauty - Premium Cosmetics UAE', description: 'Shop authentic beauty products in UAE', keywords: 'cosmetics, beauty, UAE' },
        { page: 'about', title: 'About Elissh Beauty', description: 'Learn about our premium beauty products', keywords: 'about, elissh, beauty' },
        { page: 'contact', title: 'Contact Elissh Beauty', description: 'Get in touch with us', keywords: 'contact, support' }
      ];
      
      for (const seo of seoPages) {
        await SEO.create(seo);
      }
      console.log('✅ SEO data created');
    }
    
    console.log('🎉 Production fixes completed!');
    console.log('📧 Admin: admin@elisshbeauty.ae');
    console.log('🔑 Password: admin123');
    
  } catch (error) {
    console.error('❌ Fix failed:', error);
  } finally {
    await sequelize.close();
  }
};

fixProduction();