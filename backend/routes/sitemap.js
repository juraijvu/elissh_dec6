import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import SEO from '../models/SEO.js';

const router = express.Router();

// Generate XML sitemap
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://elissh.com';
    
    // Get all products and categories
    const [products, categories] = await Promise.all([
      Product.findAll({ where: { isActive: true } }),
      Category.findAll({ where: { isActive: true } })
    ]);

    // Get SEO data for priority and change frequency
    const seoData = await SEO.findAll();
    const seoMap = new Map();
    seoData.forEach(seo => {
      seoMap.set(`${seo.entityType}-${seo.entityId}`, seo);
    });

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Homepage -->
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/sale</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>${baseUrl}/brands</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;

    // Add categories
    categories.forEach(category => {
      const seo = seoMap.get(`category-${category.id}`);
      const priority = seo?.priority || 0.8;
      const changefreq = seo?.changeFreq || 'weekly';
      
      sitemap += `  <url>
    <loc>${baseUrl}/category/${category.slug}</loc>
    <lastmod>${category.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
    });

    // Add products
    products.forEach(product => {
      const seo = seoMap.get(`product-${product.id}`);
      const priority = seo?.priority || 0.6;
      const changefreq = seo?.changeFreq || 'weekly';
      
      sitemap += `  <url>
    <loc>${baseUrl}/product/${product.slug || product.id}</loc>
    <lastmod>${product.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
    });

    sitemap += `</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).json({ message: 'Error generating sitemap' });
  }
});

// Generate robots.txt
router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://elissh.com';
  
  const robots = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/api/sitemap/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /
Allow: /category/
Allow: /product/
Allow: /sale
Allow: /brands

# Crawl delay
Crawl-delay: 1`;

  res.set('Content-Type', 'text/plain');
  res.send(robots);
});

export default router;