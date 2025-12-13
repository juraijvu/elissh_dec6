#!/bin/bash
echo "🚀 Deploying Banner Updates to Production..."

# Copy banner images to production uploads folder
echo "📁 Copying banner images..."
cp src/assets/new_arrival_*.png backend/uploads/banners/
cp src/assets/hero_*.* backend/uploads/banners/

# Run banner seeding scripts
echo "🌱 Seeding banners in production..."
cd backend

# Seed new arrivals
node -e "
import sequelize from './config/database.js';
import Banner from './models/Banner.js';

const seedBanners = async () => {
  await sequelize.authenticate();
  
  // New arrivals
  await Banner.destroy({ where: { area: 'new-arrival-banner' } });
  await Banner.bulkCreate([
    { name: 'New Arrival 1', area: 'new-arrival-banner', heading: 'Fresh Glow Serum', subHeading: 'Radiant Skin Collection', image: '/uploads/banners/new_arrival_1.png', link: '/category/skincare', buttonText: 'Shop Now', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.4, textAlignment: 'center', isActive: true, sortOrder: 1 },
    { name: 'New Arrival 2', area: 'new-arrival-banner', heading: 'Luxury Lipstick', subHeading: 'Matte Perfection', image: '/uploads/banners/new_arrival_2.png', link: '/category/makeup', buttonText: 'Explore', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.3, textAlignment: 'center', isActive: true, sortOrder: 2 },
    { name: 'New Arrival 3', area: 'new-arrival-banner', heading: 'Oud Essence', subHeading: 'Premium Fragrance', image: '/uploads/banners/new_arrival_3.png', link: '/category/fragrance', buttonText: 'Discover', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.4, textAlignment: 'center', isActive: true, sortOrder: 3 },
    { name: 'New Arrival 4', area: 'new-arrival-banner', heading: 'Hair Revival Mask', subHeading: 'Intensive Treatment', image: '/uploads/banners/new_arrival_4.png', link: '/category/haircare', buttonText: 'Try Now', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.3, textAlignment: 'center', isActive: true, sortOrder: 4 },
    { name: 'New Arrival 5', area: 'new-arrival-banner', heading: 'Eye Shadow Palette', subHeading: 'Desert Dreams', image: '/uploads/banners/new_arrival_5.png', link: '/category/makeup', buttonText: 'Shop Collection', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.4, textAlignment: 'center', isActive: true, sortOrder: 5 },
    { name: 'New Arrival 6', area: 'new-arrival-banner', heading: 'Vitamin C Cream', subHeading: 'Brightening Formula', image: '/uploads/banners/new_arrival_6.png', link: '/category/skincare', buttonText: 'Get Glowing', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.3, textAlignment: 'center', isActive: true, sortOrder: 6 },
    { name: 'New Arrival 7', area: 'new-arrival-banner', heading: 'Rose Gold Highlighter', subHeading: 'Luminous Finish', image: '/uploads/banners/new_arrival_7.png', link: '/category/makeup', buttonText: 'Shine Bright', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.4, textAlignment: 'center', isActive: true, sortOrder: 7 }
  ]);
  
  // Hero banners
  await Banner.destroy({ where: { area: ['hero-slider', 'hero-bottom-left', 'hero-bottom-right'] } });
  await Banner.bulkCreate([
    { name: 'Hero Top', area: 'hero-slider', heading: 'Discover Beauty', subHeading: 'Premium Cosmetics Collection', image: '/uploads/banners/hero_top.jpg', link: '/products', buttonText: 'Shop Now', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.3, textAlignment: 'center', isActive: true, sortOrder: 1 },
    { name: 'Hero Bottom Left', area: 'hero-bottom-left', heading: 'Luxury Skincare', subHeading: 'Premium Collection', image: '/uploads/banners/hero_bottom_left.jpg', link: '/category/skincare', buttonText: 'Shop Now', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.4, textAlignment: 'left', isActive: true, sortOrder: 1 },
    { name: 'Hero Bottom Right', area: 'hero-bottom-right', heading: 'Makeup Essentials', subHeading: 'Beauty Must-Haves', image: '/uploads/banners/hero_bottom_right.png', link: '/category/makeup', buttonText: 'Explore', textColor: '#ffffff', overlayColor: '#000000', overlayOpacity: 0.4, textAlignment: 'right', isActive: true, sortOrder: 1 }
  ]);
  
  console.log('✅ All banners seeded successfully');
  await sequelize.close();
};

seedBanners().catch(console.error);
"

echo "✅ Banner deployment complete!"