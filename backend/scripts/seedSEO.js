import sequelize from '../config/database.js';
import { Product, Category, SEO } from '../models/index.js';

const seedSEOData = async () => {
  try {
    console.log('🔍 Starting SEO data seeding...');

    // Get all products and categories
    const [products, categories] = await Promise.all([
      Product.findAll(),
      Category.findAll()
    ]);

    console.log(`📦 Found ${products.length} products and ${categories.length} categories`);

    // Generate SEO data for products
    for (const product of products) {
      const seoData = {
        entityType: 'product',
        entityId: product.id,
        title: `${product.name} - ${product.brand} | Elissh Beauty`,
        metaDescription: `Shop ${product.name} by ${product.brand}. ${product.shortDescription || product.description.substring(0, 100)}. Free shipping in UAE.`,
        slug: product.slug || `${product.brand.toLowerCase()}-${product.name.toLowerCase()}`.replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        h1: `${product.name} - ${product.brand}`,
        primaryKeyword: `${product.name.toLowerCase()} ${product.brand.toLowerCase()}`,
        secondaryKeywords: [
          `${product.brand.toLowerCase()} cosmetics`,
          `${product.name.toLowerCase()} uae`,
          `buy ${product.name.toLowerCase()}`,
          'beauty products uae',
          'cosmetics online'
        ],
        lsiKeywords: [
          'makeup',
          'skincare',
          'beauty',
          'cosmetics',
          'uae',
          'dubai',
          'abu dhabi'
        ],
        ogTitle: `${product.name} - ${product.brand}`,
        ogDescription: `Shop ${product.name} by ${product.brand}. Premium beauty products with free shipping in UAE.`,
        twitterTitle: `${product.name} - ${product.brand}`,
        twitterDescription: `Shop ${product.name} by ${product.brand}. Premium beauty products with free shipping in UAE.`,
        canonicalUrl: `https://elissh.com/product/${product.slug || product.id}`,
        priority: product.isFeatured ? 0.8 : 0.6,
        changeFreq: 'weekly',
        isActive: true
      };

      await SEO.upsert(seoData);
    }

    // Generate SEO data for categories
    for (const category of categories) {
      const seoData = {
        entityType: 'category',
        entityId: category.id,
        title: `${category.name} - Premium Beauty Products | Elissh`,
        metaDescription: `Discover premium ${category.name.toLowerCase()} products. Shop authentic beauty brands with free shipping in UAE. Best prices guaranteed.`,
        slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        h1: category.name,
        primaryKeyword: category.name.toLowerCase(),
        secondaryKeywords: [
          `${category.name.toLowerCase()} uae`,
          `best ${category.name.toLowerCase()}`,
          `premium ${category.name.toLowerCase()}`,
          `${category.name.toLowerCase()} online`,
          `buy ${category.name.toLowerCase()}`
        ],
        lsiKeywords: [
          'beauty products',
          'cosmetics',
          'makeup',
          'skincare',
          'uae',
          'dubai',
          'online shopping'
        ],
        seoContent: generateCategoryContent(category),
        ogTitle: `${category.name} - Premium Beauty Products`,
        ogDescription: `Discover premium ${category.name.toLowerCase()} products. Shop authentic beauty brands with free shipping in UAE.`,
        twitterTitle: `${category.name} - Premium Beauty Products`,
        twitterDescription: `Discover premium ${category.name.toLowerCase()} products. Shop authentic beauty brands with free shipping in UAE.`,
        canonicalUrl: `https://elissh.com/category/${category.slug}`,
        priority: 0.8,
        changeFreq: 'weekly',
        isActive: true
      };

      await SEO.upsert(seoData);
    }

    console.log('✅ SEO data seeding completed successfully!');
    console.log(`📊 Created SEO data for ${products.length} products and ${categories.length} categories`);

  } catch (error) {
    console.error('❌ Error seeding SEO data:', error);
    throw error;
  }
};

function generateCategoryContent(category) {
  const categoryContent = {
    'Skincare': `
      <h2>Premium Skincare Products in UAE</h2>
      <p>Discover our extensive collection of premium skincare products, carefully curated for the UAE market. From cleansers and moisturizers to serums and treatments, we offer authentic beauty products from top international brands.</p>
      
      <h3>Why Choose Our Skincare Collection?</h3>
      <ul>
        <li>100% Authentic products from authorized distributors</li>
        <li>Suitable for UAE climate and skin types</li>
        <li>Free shipping across UAE</li>
        <li>Cash on delivery available</li>
        <li>Halal certified options available</li>
      </ul>
      
      <h3>Popular Skincare Categories</h3>
      <p>Browse through our popular skincare categories including anti-aging serums, hydrating moisturizers, gentle cleansers, and specialized treatments for all skin types.</p>
    `,
    'Makeup': `
      <h2>Professional Makeup Collection</h2>
      <p>Transform your look with our professional makeup collection featuring the latest trends and timeless classics. From everyday essentials to glamorous evening looks, find everything you need for flawless makeup application.</p>
      
      <h3>Complete Makeup Range</h3>
      <ul>
        <li>Foundation and concealer for all skin tones</li>
        <li>Eye makeup including eyeshadows, mascara, and eyeliners</li>
        <li>Lip products from glosses to long-lasting lipsticks</li>
        <li>Professional makeup brushes and tools</li>
        <li>Cruelty-free and vegan options</li>
      </ul>
    `,
    'Fragrance': `
      <h2>Luxury Fragrances Collection</h2>
      <p>Indulge in our exquisite collection of luxury fragrances featuring both international designer brands and niche perfume houses. Find your signature scent from our carefully curated selection.</p>
      
      <h3>Fragrance Categories</h3>
      <ul>
        <li>Women's perfumes - floral, oriental, and fresh scents</li>
        <li>Men's colognes - woody, citrus, and spicy fragrances</li>
        <li>Unisex fragrances for modern lifestyles</li>
        <li>Travel-size options perfect for on-the-go</li>
        <li>Gift sets for special occasions</li>
      </ul>
    `,
    'Hair Care': `
      <h2>Professional Hair Care Solutions</h2>
      <p>Achieve salon-quality results at home with our professional hair care collection. From nourishing shampoos to styling products, we have everything for healthy, beautiful hair.</p>
      
      <h3>Hair Care Essentials</h3>
      <ul>
        <li>Shampoos and conditioners for all hair types</li>
        <li>Hair treatments and masks for deep nourishment</li>
        <li>Styling products for perfect looks</li>
        <li>Heat protection and UV protection</li>
        <li>Natural and organic hair care options</li>
      </ul>
    `
  };

  return categoryContent[category.name] || `
    <h2>${category.name} Collection</h2>
    <p>Explore our premium ${category.name.toLowerCase()} collection featuring authentic products from top international brands. Shop with confidence knowing you're getting genuine products with free shipping across UAE.</p>
    
    <h3>Why Shop ${category.name} with Elissh?</h3>
    <ul>
      <li>100% Authentic products guaranteed</li>
      <li>Free shipping across UAE</li>
      <li>Cash on delivery available</li>
      <li>Easy returns and exchanges</li>
      <li>Expert customer support</li>
    </ul>
  `;
}

// Run the seeding function if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedSEOData()
    .then(() => {
      console.log('SEO seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('SEO seeding failed:', error);
      process.exit(1);
    });
}

export default seedSEOData;