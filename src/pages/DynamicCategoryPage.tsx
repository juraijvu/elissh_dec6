import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { CategoryPageBanner } from "@/components/CategoryPageBanner";
import { useParams } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { productsAPI, categoriesAPI } from "@/lib/api";
import SEOHead from "@/components/SEOHead";
import Breadcrumbs from "@/components/Breadcrumbs";
import makeupImage from "@/assets/category-makeup.jpg";
import skincareImage from "@/assets/category-skincare.jpg";
import fragranceImage from "@/assets/category-fragrance.jpg";
import haircareImage from "@/assets/category-haircare.jpg";

const DynamicCategoryPage = () => {
  const { category = "makeup" } = useParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('best-selling');
  const [filters, setFilters] = useState({
    priceRange: [],
    rating: [],
    features: []
  });

  const categoryImages = {
    'makeup': makeupImage,
    'face': makeupImage,
    'eyes': makeupImage,
    'lips': makeupImage,
    'skincare': skincareImage,
    'fragrance': fragranceImage,
    'hair care': haircareImage,
    'body care': skincareImage
  };

  useEffect(() => {
    fetchData();
  }, [category]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoriesRes, productsRes] = await Promise.all([
        categoriesAPI.getCategories(),
        productsAPI.getProducts({ limit: 50 })
      ]);

      setCategories(categoriesRes.categories || []);
      
      // Filter products by category if a specific category is selected
      const currentCategory = categoriesRes.categories?.find(
        cat => cat.name.toLowerCase() === category.toLowerCase()
      );
      
      if (currentCategory) {
        const categoryProducts = await productsAPI.getProducts({ 
          category: currentCategory.id,
          limit: 50 
        });
        setProducts(categoryProducts.products || []);
      } else {
        setProducts(productsRes.products || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentCategory = categories.find(
    cat => cat.name.toLowerCase() === category.toLowerCase()
  );

  const categoryData = {
    title: currentCategory?.name || category.charAt(0).toUpperCase() + category.slice(1),
    image: categoryImages[category.toLowerCase()] || makeupImage,
    description: currentCategory?.description || `Explore our ${category} collection`
  };

  // Generate SEO data
  const seoTitle = currentCategory?.metaTitle || `${categoryData.title} - Premium Beauty Products | Elissh`;
  const seoDescription = currentCategory?.metaDescription || `Discover premium ${categoryData.title.toLowerCase()} products. Shop authentic beauty brands with free shipping in UAE. Best prices guaranteed.`;
  const seoKeywords = currentCategory?.seoKeywords || [categoryData.title.toLowerCase(), `${categoryData.title.toLowerCase()} uae`, 'beauty products', 'cosmetics'];
  const canonicalUrl = `https://elissh.com/category/${currentCategory?.slug || category}`;
  
  // Generate structured data
  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "CollectionPage",
    "name": categoryData.title,
    "description": categoryData.description,
    "url": canonicalUrl,
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://elissh.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": categoryData.title,
          "item": canonicalUrl
        }
      ]
    },
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": products.length,
      "itemListElement": products.slice(0, 10).map((product, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Product",
          "name": product.name,
          "brand": product.brand,
          "offers": {
            "@type": "Offer",
            "price": product.price,
            "priceCurrency": "AED"
          }
        }
      }))
    }
  };

  const breadcrumbItems = [
    { label: categoryData.title }
  ];

  const filteredProducts = products.filter(product => {
    // Apply price filters
    if (filters.priceRange.length > 0) {
      const matchesPrice = filters.priceRange.some(range => {
        if (range === 'under-50') return product.price < 50;
        if (range === '50-100') return product.price >= 50 && product.price <= 100;
        if (range === '100-200') return product.price > 100 && product.price <= 200;
        if (range === 'over-200') return product.price > 200;
        return false;
      });
      if (!matchesPrice) return false;
    }

    // Apply rating filters
    if (filters.rating.length > 0) {
      const matchesRating = filters.rating.some(rating => {
        const productRating = product.rating?.average || 0;
        if (rating === '5') return productRating >= 5;
        if (rating === '4') return productRating >= 4;
        if (rating === '3') return productRating >= 3;
        return false;
      });
      if (!matchesRating) return false;
    }

    // Apply feature filters
    if (filters.features.length > 0) {
      const matchesFeatures = filters.features.some(feature => {
        if (feature === 'halal') return product.isHalal;
        if (feature === 'vegan') return product.isVegan;
        if (feature === 'cruelty-free') return product.isCrueltyFree;
        return false;
      });
      if (!matchesFeatures) return false;
    }

    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter(item => item !== value)
        : [...prev[type], value]
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={seoKeywords}
        canonicalUrl={canonicalUrl}
        ogImage={categoryData.image}
        structuredData={structuredData}
      />
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Breadcrumbs items={breadcrumbItems} />
      </div>

      {/* Category Header */}
      <section className="py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold mb-4">{categoryData.title}</h1>
          <p className="text-muted-foreground text-lg lg:text-xl">{categoryData.description}</p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="container mx-auto px-4 py-8">
        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <p className="text-muted-foreground">
              Showing {loading ? '...' : filteredProducts.length} products
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            <select 
              className="border rounded-lg px-4 py-2 text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="best-selling">Best Selling</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          {showFilters && (
            <aside className="w-64 space-y-6">
              <div>
                <h3 className="font-bold text-foreground mb-3">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { value: 'under-50', label: 'Under 50 AED' },
                    { value: '50-100', label: '50 - 100 AED' },
                    { value: '100-200', label: '100 - 200 AED' },
                    { value: 'over-200', label: 'Over 200 AED' }
                  ].map(range => (
                    <label key={range.value} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={filters.priceRange.includes(range.value)}
                        onChange={() => handleFilterChange('priceRange', range.value)}
                      />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-3">Rating</h3>
                <div className="space-y-2">
                  {[
                    { value: '5', label: '⭐⭐⭐⭐⭐ & Up' },
                    { value: '4', label: '⭐⭐⭐⭐ & Up' },
                    { value: '3', label: '⭐⭐⭐ & Up' }
                  ].map(rating => (
                    <label key={rating.value} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={filters.rating.includes(rating.value)}
                        onChange={() => handleFilterChange('rating', rating.value)}
                      />
                      <span className="text-sm">{rating.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-bold text-foreground mb-3">Features</h3>
                <div className="space-y-2">
                  {[
                    { value: 'halal', label: 'Halal Certified' },
                    { value: 'vegan', label: 'Vegan' },
                    { value: 'cruelty-free', label: 'Cruelty-Free' }
                  ].map(feature => (
                    <label key={feature.value} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded" 
                        checked={filters.features.includes(feature.value)}
                        onChange={() => handleFilterChange('features', feature.value)}
                      />
                      <span className="text-sm">{feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>
          )}

          {/* Product Grid with Dynamic Banners */}
          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-8">
                {/* Render products with banners after every 3 rows (12 products) */}
                {Array.from({ length: Math.ceil(filteredProducts.length / 12) }).map((_, chunkIndex) => {
                  const startIndex = chunkIndex * 12;
                  const endIndex = Math.min(startIndex + 12, filteredProducts.length);
                  const chunkProducts = filteredProducts.slice(startIndex, endIndex);
                  
                  return (
                    <div key={chunkIndex}>
                      {/* Products Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
                        {chunkProducts.map((product) => (
                          <ProductCard key={product.id} {...product} />
                        ))}
                      </div>
                      
                      {/* Wide Banner after each chunk (except the last one if it's small) */}
                      {chunkIndex < Math.ceil(filteredProducts.length / 12) - 1 && chunkProducts.length >= 12 && (
                        <div className="mb-8">
                          <CategoryPageBanner category={category} bannerIndex={chunkIndex} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* SEO Content Section */}
      {currentCategory?.seoContent && (
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: currentCategory.seoContent }} />
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
};

export default DynamicCategoryPage;