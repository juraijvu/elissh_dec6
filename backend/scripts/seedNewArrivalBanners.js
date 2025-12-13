import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from '../config/database.js';
import Banner from '../models/Banner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedNewArrivalBanners = async () => {
  try {
    console.log('🎨 Starting New Arrival Banners Seeding...');
    console.log('📍 Current directory:', process.cwd());
    
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, '..', 'uploads', 'banners');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Copy images from frontend assets to backend uploads
    const frontendAssetsDir = path.join(__dirname, '..', '..', 'src', 'assets');
    
    const imageFiles = [
      'new_arrival_1.png',
      'new_arrival_2.png', 
      'new_arrival_3.png',
      'new_arrival_4.png',
      'new_arrival_5.png',
      'new_arrival_6.png',
      'new_arrival_7.png'
    ];

    // Copy images to uploads folder
    for (const imageFile of imageFiles) {
      const sourcePath = path.join(frontendAssetsDir, imageFile);
      const destPath = path.join(uploadsDir, imageFile);
      
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied ${imageFile} to uploads folder`);
      } else {
        console.log(`⚠️  Warning: ${imageFile} not found in assets folder`);
      }
    }

    // Clear existing new-arrival-banner entries
    await Banner.destroy({
      where: { area: 'new-arrival-banner' }
    });
    console.log('🗑️  Cleared existing new arrival banners');

    // New arrival banner data
    const newArrivalBanners = [
      {
        name: 'New Arrival Banner 1',
        area: 'new-arrival-banner',
        heading: 'Fresh Glow Serum',
        subHeading: 'Radiant Skin Collection',
        description: 'Discover our latest skincare innovation for luminous, healthy-looking skin',
        image: '/uploads/banners/new_arrival_1.png',
        link: '/category/skincare',
        buttonText: 'Shop Now',
        textColor: '#ffffff',
        overlayColor: '#000000',
        overlayOpacity: 0.4,
        textAlignment: 'center',
        isActive: true,
        sortOrder: 1
      },
      {
        name: 'New Arrival Banner 2', 
        area: 'new-arrival-banner',
        heading: 'Luxury Lipstick',
        subHeading: 'Matte Perfection',
        description: 'Long-lasting, highly pigmented formula for all-day wear',
        image: '/uploads/banners/new_arrival_2.png',
        link: '/category/makeup',
        buttonText: 'Explore',
        textColor: '#ffffff',
        overlayColor: '#000000',
        overlayOpacity: 0.3,
        textAlignment: 'center',
        isActive: true,
        sortOrder: 2
      },
      {
        name: 'New Arrival Banner 3',
        area: 'new-arrival-banner', 
        heading: 'Oud Essence',
        subHeading: 'Premium Fragrance',
        description: 'Authentic Arabian fragrance crafted with the finest ingredients',
        image: '/uploads/banners/new_arrival_3.png',
        link: '/category/fragrance',
        buttonText: 'Discover',
        textColor: '#ffffff',
        overlayColor: '#000000',
        overlayOpacity: 0.4,
        textAlignment: 'center',
        isActive: true,
        sortOrder: 3
      },
      {
        name: 'New Arrival Banner 4',
        area: 'new-arrival-banner',
        heading: 'Hair Revival Mask',
        subHeading: 'Intensive Treatment',
        description: 'Restore and strengthen damaged hair with our nourishing formula',
        image: '/uploads/banners/new_arrival_4.png',
        link: '/category/haircare',
        buttonText: 'Try Now',
        textColor: '#ffffff',
        overlayColor: '#000000',
        overlayOpacity: 0.3,
        textAlignment: 'center',
        isActive: true,
        sortOrder: 4
      },
      {
        name: 'New Arrival Banner 5',
        area: 'new-arrival-banner',
        heading: 'Eye Shadow Palette',
        subHeading: 'Desert Dreams',
        description: 'Warm, earthy tones inspired by the beauty of the UAE landscape',
        image: '/uploads/banners/new_arrival_5.png',
        link: '/category/makeup',
        buttonText: 'Shop Collection',
        textColor: '#ffffff',
        overlayColor: '#000000',
        overlayOpacity: 0.4,
        textAlignment: 'center',
        isActive: true,
        sortOrder: 5
      },
      {
        name: 'New Arrival Banner 6',
        area: 'new-arrival-banner',
        heading: 'Vitamin C Cream',
        subHeading: 'Brightening Formula',
        description: 'Illuminate your complexion with our powerful antioxidant blend',
        image: '/uploads/banners/new_arrival_6.png',
        link: '/category/skincare',
        buttonText: 'Get Glowing',
        textColor: '#ffffff',
        overlayColor: '#000000',
        overlayOpacity: 0.3,
        textAlignment: 'center',
        isActive: true,
        sortOrder: 6
      },
      {
        name: 'New Arrival Banner 7',
        area: 'new-arrival-banner',
        heading: 'Rose Gold Highlighter',
        subHeading: 'Luminous Finish',
        description: 'Add the perfect glow to your makeup look with our silky highlighter',
        image: '/uploads/banners/new_arrival_7.png',
        link: '/category/makeup',
        buttonText: 'Shine Bright',
        textColor: '#ffffff',
        overlayColor: '#000000',
        overlayOpacity: 0.4,
        textAlignment: 'center',
        isActive: true,
        sortOrder: 7
      }
    ];

    // Insert new arrival banners
    const createdBanners = await Banner.bulkCreate(newArrivalBanners);
    console.log(`✅ Created ${createdBanners.length} new arrival banners`);

    console.log('🎉 New Arrival Banners seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log(`- Images copied: ${imageFiles.length}`);
    console.log(`- Banners created: ${createdBanners.length}`);
    console.log('- Area: new-arrival-banner');
    console.log('- All banners are active and ready to display');

  } catch (error) {
    console.error('❌ Error seeding new arrival banners:', error);
    throw error;
  }
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('🚀 Starting new arrival banners setup...');
  
  sequelize.authenticate()
    .then(() => {
      console.log('📡 Database connected successfully');
      return sequelize.sync();
    })
    .then(() => {
      console.log('🔄 Database synced');
      return seedNewArrivalBanners();
    })
    .then(() => {
      console.log('✅ Seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error.message);
      console.error('Stack trace:', error.stack);
      process.exit(1);
    });
}

export default seedNewArrivalBanners;