import { Header } from "@/components/Header";
import NewHeroSection from "@/components/NewHeroSection";
import ProductCarousel from "@/components/ProductCarousel";
import { CategoryCard } from "@/components/CategoryCard";
import { Footer } from "@/components/Footer";
import DynamicBanner from "@/components/DynamicBanner";
import { Sparkles, TrendingUp, Clock, Gift } from "lucide-react";
import skincareImage from "@/assets/category-skincare.jpg";
import makeupImage from "@/assets/category-makeup.jpg";
import fragranceImage from "@/assets/category-fragrance.jpg";
import haircareImage from "@/assets/category-haircare.jpg";

const generateProducts = (count: number, baseProducts: any[]) => {
  const products = [];
  for (let i = 0; i < count; i++) {
    const baseProduct = baseProducts[i % baseProducts.length];
    products.push({
      ...baseProduct,
      id: baseProduct.id + i * 100,
      name: `${baseProduct.name} - Variant ${i + 1}`,
    });
  }
  return products;
};

const baseProducts = [
  {
    id: 1,
    image: makeupImage,
    name: "Matte Luxe Lipstick - Desert Rose",
    brand: "Elissh Signature",
    price: 89.99,
    originalPrice: 129.99,
    rating: 4.8,
    reviews: 234,
    badge: "Bestseller",
  },
  {
    id: 2,
    image: skincareImage,
    name: "Hydrating Glow Serum with Hyaluronic Acid",
    brand: "SkinLuxe",
    price: 149.99,
    rating: 4.9,
    reviews: 456,
    badge: "New",
  },
  {
    id: 3,
    image: fragranceImage,
    name: "Oud Royal Eau de Parfum 100ml",
    brand: "Arabia Essence",
    price: 299.99,
    originalPrice: 399.99,
    rating: 4.7,
    reviews: 189,
    badge: "Limited",
  },
  {
    id: 4,
    image: haircareImage,
    name: "Keratin Repair Hair Mask - Intense",
    brand: "HairRevive",
    price: 119.99,
    rating: 4.6,
    reviews: 312,
  },
];

const featuredProducts = generateProducts(12, baseProducts);

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* New Hero Section */}
      <NewHeroSection />

      {/* Handpicked For You */}
      <ProductCarousel
        products={featuredProducts}
        title="Handpicked For You"
        subtitle="Personalized recommendations based on your beauty profile"
        icon={<Sparkles className="h-7 w-7 text-primary" />}
      />

      {/* Product Categories (5x2 Grid) */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
          {[
            { title: "Makeup", image: makeupImage, itemCount: 1250 },
            { title: "Skincare", image: skincareImage, itemCount: 890 },
            { title: "Fragrance", image: fragranceImage, itemCount: 567 },
            { title: "Haircare", image: haircareImage, itemCount: 423 },
            { title: "Tools", image: makeupImage, itemCount: 234 },
            { title: "Lips", image: makeupImage, itemCount: 456 },
            { title: "Eyes", image: makeupImage, itemCount: 389 },
            { title: "Face", image: skincareImage, itemCount: 678 },
            { title: "Nails", image: makeupImage, itemCount: 156 },
            { title: "Gifts", image: fragranceImage, itemCount: 234 },
          ].map((category) => (
            <CategoryCard key={category.title} {...category} />
          ))}
        </div>
      </section>

      {/* Special Offers */}
      <ProductCarousel
        products={generateProducts(16, baseProducts)}
        title="Special Offers"
        badge="Special Offer"
      />

      {/* Wide Banner */}
      <section className="container mx-auto px-4 py-12">
        <DynamicBanner 
          area="wide-banner" 
          className="w-full" 
          aspectRatio="aspect-[16/6]" 
          fallbackImage={makeupImage}
        />
      </section>

      {/* After Special Offers - 3 Dynamic Banners */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6">
          <DynamicBanner 
            area="after-special-offers" 
            bannerIndex={0}
            className="w-full" 
            aspectRatio="aspect-[16/10]" 
            fallbackImage={makeupImage}
          />
          <DynamicBanner 
            area="after-special-offers" 
            bannerIndex={1}
            className="w-full" 
            aspectRatio="aspect-[16/10]" 
            fallbackImage={skincareImage}
          />
          <DynamicBanner 
            area="after-special-offers" 
            bannerIndex={2}
            className="w-full" 
            aspectRatio="aspect-[16/10]" 
            fallbackImage={fragranceImage}
          />
        </div>
      </section>

      {/* High Demand Products */}
      <div className="bg-gradient-to-b from-secondary/30 to-transparent rounded-3xl">
        <ProductCarousel
          products={generateProducts(10, baseProducts)}
          title="High Demand in UAE"
          subtitle="Trending products loved by beauty enthusiasts"
          icon={<TrendingUp className="h-7 w-7 text-primary" />}
          badge="Trending in Dubai"
        />
      </div>

      {/* Limited Time Offers */}
      <ProductCarousel
        products={generateProducts(8, baseProducts).map(p => ({ ...p, originalPrice: p.price * 1.5 }))}
        title="Limited Time Offers"
        subtitle="Hurry! These deals won't last long"
        icon={<Clock className="h-7 w-7 text-destructive" />}
        badge="Flash Sale"
      />

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
        </div>
      </section>

      {/* Budget Beauty Bundles */}
      <div className="bg-gradient-to-b from-accent/10 to-transparent rounded-3xl">
        <ProductCarousel
          products={generateProducts(10, baseProducts).map(p => ({ ...p, price: p.price * 0.7, originalPrice: p.price }))}
          title="Budget Beauty Bundles"
          subtitle="Complete looks under 200 AED"
          icon={<Gift className="h-7 w-7 text-primary" />}
          badge="Bundle Deal"
        />
      </div>

      {/* Essential Products for You */}
      <ProductCarousel
        products={generateProducts(12, baseProducts)}
        title="Essential Products for You"
        subtitle="Must-have items for your beauty routine"
        icon={<Sparkles className="h-7 w-7 text-primary" />}
        badge="Essential"
      />

      {/* Wide Product Banners (Top & Bottom) */}
      <section className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          <DynamicBanner 
            area="wide-banner-top" 
            className="w-full" 
            aspectRatio="aspect-[16/6]" 
            fallbackImage={fragranceImage}
          />
          <DynamicBanner 
            area="wide-banner-bottom" 
            className="w-full" 
            aspectRatio="aspect-[16/6]" 
            fallbackImage={haircareImage}
          />
        </div>
      </section>

      {/* Amazing Deal Sections */}
      <div className="bg-gradient-to-b from-destructive/5 to-transparent rounded-3xl">
        <ProductCarousel
          products={generateProducts(15, baseProducts).map((p, i) => ({ ...p, originalPrice: p.price * 1.6, badge: `${40 + (i % 6) * 5}% OFF` }))}
          title="Amazing Deals"
          subtitle="Today's best discounts"
          showViewAll={false}
        />
      </div>

      {/* Trending Categories on Elissh */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
          Trending Categories
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {[
            { title: "K-Beauty", image: skincareImage, searches: "10K+" },
            { title: "Vegan Makeup", image: makeupImage, searches: "8K+" },
            { title: "Arab Fragrances", image: fragranceImage, searches: "15K+" },
            { title: "Hair Treatments", image: haircareImage, searches: "6K+" },
            { title: "Natural Skincare", image: skincareImage, searches: "12K+" },
            { title: "Luxury Beauty", image: makeupImage, searches: "9K+" },
          ].map((cat) => (
            <div key={cat.title} className="relative rounded-2xl overflow-hidden shadow-soft h-48 cursor-pointer">
              <img src={cat.image} alt={cat.title} className="w-full h-full object-cover" />
            </div>
          ))}
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
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Easy Returns</h3>
            <p className="text-sm text-muted-foreground">14-day return policy</p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Halal Certified</h3>
            <p className="text-sm text-muted-foreground">Verified halal products</p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">24/7 Support</h3>
            <p className="text-sm text-muted-foreground">Always here to help</p>
          </div>
          <div className="bg-gradient-card rounded-2xl p-6 text-center shadow-soft">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-bold text-foreground mb-2">Secure Payment</h3>
            <p className="text-sm text-muted-foreground">100% secure checkout</p>
          </div>
        </div>
      </section>

      {/* Application Download Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-primary rounded-3xl p-8 lg:p-12 text-center shadow-elevated">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
            Download Our App
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8">
            Get exclusive app-only deals and early access to sales
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-background text-foreground px-8 py-4 rounded-full font-semibold hover:bg-background/90 transition-all flex items-center gap-3 shadow-soft">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              App Store
            </button>
            <button className="bg-background text-foreground px-8 py-4 rounded-full font-semibold hover:bg-background/90 transition-all flex items-center gap-3 shadow-soft">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
              </svg>
              Google Play
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="bg-gradient-card rounded-3xl p-8 lg:p-12 shadow-soft">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-foreground mb-2">Email Us</h3>
              <p className="text-muted-foreground">support@elisshbeauty.ae</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-foreground mb-2">Call Us</h3>
              <p className="text-muted-foreground">800-ELISSH (Free in UAE)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-foreground mb-2">Live Chat</h3>
              <button className="text-primary font-semibold hover:underline">Start Chat</button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
