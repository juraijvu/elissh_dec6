import { useState, useEffect } from 'react';
import { Header } from "@/components/Header";
import NewHeroSection from "@/components/NewHeroSection";
import ProductCarousel from "@/components/ProductCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import DynamicBanner from "@/components/DynamicBanner";
import { Sparkles, TrendingUp, Clock, Gift } from "lucide-react";
import { productsAPI, categoriesAPI } from "@/lib/api";
import { useSEO } from "@/hooks/useSEO";
import skincareImage from "@/assets/category-skincare.jpg";
import makeupImage from "@/assets/category-makeup.jpg";
import fragranceImage from "@/assets/category-fragrance.jpg";
import haircareImage from "@/assets/category-haircare.jpg";

const DynamicIndex = () => {
  useSEO('home');
  
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [saleProducts, setSaleProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [featuredRes, saleRes, allRes, categoriesRes] = await Promise.all([
        productsAPI.getFeaturedProducts(),
        productsAPI.getSaleProducts(),
        productsAPI.getProducts({ limit: 20 }),
        categoriesAPI.getCategories()
      ]);

      setFeaturedProducts(featuredRes.products || []);
      setSaleProducts(saleRes.products || []);
      setAllProducts(allRes.products || []);
      setCategories(categoriesRes.categories || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const categoryImages = {
    'Face': makeupImage,
    'Eyes': makeupImage,
    'Lips': makeupImage,
    'Skincare': skincareImage,
    'Fragrance': fragranceImage,
    'Hair Care': haircareImage,
    'Body Care': skincareImage
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <NewHeroSection />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <ProductCarousel
          products={featuredProducts}
          title="Featured Products"
          subtitle="Handpicked favorites from our collection"
          icon={<Sparkles className="h-7 w-7 text-primary" />}
        />
      )}

      {/* Product Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {categories.map((category) => (
            <CategoryCard 
              key={category.id} 
              title={category.name}
              image={categoryImages[category.name] || makeupImage}
              itemCount={category.productCount || 0}
            />
          ))}
        </div>
      </section>

      {/* Sale Products */}
      {saleProducts.length > 0 && (
        <ProductCarousel
          products={saleProducts}
          title="Special Offers"
          subtitle="Limited time deals you don't want to miss"
          badge="Special Offer"
        />
      )}

      {/* Offer Product Banner */}
      <section className="container mx-auto px-4 py-12">
        <DynamicBanner 
          area="after-special-offers" 
          bannerIndex={0}
          className="w-full" 
          aspectRatio="aspect-[16/6]" 
          fallbackImage={makeupImage}
        />
      </section>

      {/* Two Prime Product Banners */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          <DynamicBanner 
            area="after-special-offers" 
            bannerIndex={1}
            className="w-full" 
            aspectRatio="aspect-[16/10]" 
            fallbackImage={makeupImage}
          />
          <DynamicBanner 
            area="after-special-offers" 
            bannerIndex={2}
            className="w-full" 
            aspectRatio="aspect-[16/10]" 
            fallbackImage={skincareImage}
          />
        </div>
      </section>

      {/* All Products */}
      {allProducts.length > 0 && (
        <div className="bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl">
          <ProductCarousel
            products={allProducts}
            title="Popular Products"
            subtitle="Trending products loved by beauty enthusiasts"
            icon={<TrendingUp className="h-7 w-7 text-primary" />}
            badge="Popular"
          />
        </div>
      )}

      {/* New Arrival Product Creatives */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">New Arrivals</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={0}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={makeupImage}
          />
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={1}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={skincareImage}
          />
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={2}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={fragranceImage}
          />
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={3}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={haircareImage}
          />
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={4}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={makeupImage}
          />
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={5}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={skincareImage}
          />
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={6}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={fragranceImage}
          />
          <DynamicBanner 
            area="new-arrival-banner" 
            bannerIndex={7}
            className="w-full" 
            aspectRatio="aspect-[3/4]" 
            fallbackImage={haircareImage}
          />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">100% Authentic</h3>
            <p className="text-sm text-muted-foreground">Genuine products guaranteed</p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Free Shipping</h3>
            <p className="text-sm text-muted-foreground">On orders over 100 AED</p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Fast Delivery</h3>
            <p className="text-sm text-muted-foreground">1-3 days across UAE</p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">COD Available</h3>
            <p className="text-sm text-muted-foreground">Cash on Delivery option</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DynamicIndex;