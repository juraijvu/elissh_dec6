import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { bannerAPI } from '@/lib/api';

const NewHeroSection = () => {
  const [heroBanner, setHeroBanner] = useState(null);
  const [leftBanner, setLeftBanner] = useState(null);
  const [rightBanner, setRightBanner] = useState(null);
  const [bottomLeftBanner, setBottomLeftBanner] = useState(null);
  const [bottomRightBanner, setBottomRightBanner] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:';
    return `${baseUrl}${image}`;
  };

  // Fallback banner if no CMS data
  const fallbackHero = {
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&h=350&fit=crop',
    heading: 'Summer Beauty Collection',
    subHeading: 'Up to 50% Off Selected Items',
    buttonText: 'Shop Now',
    link: '/sale'
  };

  useEffect(() => {
    const loadBanners = async () => {
      try {
        console.log('🏠 Loading hero section banners...');
        const [hero, left, right, bottomLeft, bottomRight] = await Promise.all([
          bannerAPI.getBanners('hero-slider'),
          bannerAPI.getBanners('hero-left'),
          bannerAPI.getBanners('hero-right'),
          bannerAPI.getBanners('hero-bottom-left'),
          bannerAPI.getBanners('hero-bottom-right')
        ]);
        
        const heroData = hero.banners || [];
        const leftData = left.banners || [];
        const rightData = right.banners || [];
        const bottomLeftData = bottomLeft.banners || [];
        const bottomRightData = bottomRight.banners || [];
        
        console.log('📊 Banner counts:', {
          hero: heroData.length,
          left: leftData.length,
          right: rightData.length,
          bottomLeft: bottomLeftData.length,
          bottomRight: bottomRightData.length
        });
        
        setHeroBanner(heroData[0] || fallbackHero);
        setLeftBanner(leftData[0]);
        setRightBanner(rightData[0]);
        setBottomLeftBanner(bottomLeftData[0]);
        setBottomRightBanner(bottomRightData[0]);
      } catch (error) {
        console.error('Failed to load banners:', error);
        setHeroBanner(fallbackHero);
      }
    };
    
    loadBanners();
    
    // Listen for banner updates
    const handleBannerUpdate = () => {
      console.log('🔄 Banner update event received, refreshing hero banners...');
      setRefreshKey(prev => prev + 1);
      setTimeout(() => {
        loadBanners();
      }, 100);
    };
    
    const handleBannerChanged = () => {
      console.log('🔄 Banner changed event received, force refreshing...');
      setRefreshKey(prev => prev + 1);
      loadBanners();
    };
    
    window.addEventListener('bannersUpdated', handleBannerUpdate);
    window.addEventListener('bannerChanged', handleBannerChanged);
    
    return () => {
      window.removeEventListener('bannersUpdated', handleBannerUpdate);
      window.removeEventListener('bannerChanged', handleBannerChanged);
    };
  }, [refreshKey]);

  const currentBanner = heroBanner || fallbackHero;

  return (
    <section className="container mx-auto px-4 py-4 lg:py-8">
      {/* Mobile Layout */}
      <div className="lg:hidden space-y-4">
        {/* Main Hero Banner - Full Width on Mobile */}
        <div className="h-[200px] sm:h-[250px] relative rounded-lg overflow-hidden cursor-pointer">
          <img 
            key={`hero-mobile-${refreshKey}-${currentBanner.id || 'fallback'}`}
            src={getImageUrl(currentBanner.image) || currentBanner.image} 
            alt={currentBanner.heading}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-center text-white">
              <h2 className="text-lg sm:text-xl font-bold mb-1">{currentBanner.heading}</h2>
              {currentBanner.subHeading && (
                <p className="text-sm mb-2">{currentBanner.subHeading}</p>
              )}
              {currentBanner.buttonText && (
                <button className="bg-white text-black px-4 py-2 rounded text-sm font-semibold">
                  {currentBanner.buttonText}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side Banners - Horizontal on Mobile */}
        <div className="grid grid-cols-2 gap-3 h-[120px] sm:h-[140px]">
          <div className="relative rounded-lg overflow-hidden cursor-pointer">
            <img 
              key={`left-mobile-${refreshKey}-${leftBanner?.id || 'fallback'}`}
              src={getImageUrl(leftBanner?.image) || 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=140&fit=crop'} 
              alt={leftBanner?.heading || 'Side Banner'} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative rounded-lg overflow-hidden cursor-pointer">
            <img 
              key={`right-mobile-${refreshKey}-${rightBanner?.id || 'fallback'}`}
              src={getImageUrl(rightBanner?.image) || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=140&fit=crop'} 
              alt={rightBanner?.heading || 'Side Banner'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Bottom Banners - Stacked on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 h-auto">
          <div className="h-[120px] sm:h-[140px] relative rounded-lg overflow-hidden cursor-pointer">
            <img 
              src={getImageUrl(bottomLeftBanner?.image) || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=140&fit=crop'} 
              alt={bottomLeftBanner?.heading || 'Makeup Collection'} 
              className="w-full h-full object-cover"
            />
            {bottomLeftBanner && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white px-2">
                  <h4 className="text-sm font-bold">{bottomLeftBanner.heading}</h4>
                </div>
              </div>
            )}
          </div>
          <div className="h-[120px] sm:h-[140px] relative rounded-lg overflow-hidden cursor-pointer">
            <img 
              src={getImageUrl(bottomRightBanner?.image) || 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=140&fit=crop'} 
              alt={bottomRightBanner?.heading || 'Skincare Essentials'} 
              className="w-full h-full object-cover"
            />
            {bottomRightBanner && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center text-white px-2">
                  <h4 className="text-sm font-bold">{bottomRightBanner.heading}</h4>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex gap-4 h-[500px]">
        {/* Left Side Banner */}
        <div className="w-[200px] h-full">
          <div className="relative w-full h-full rounded overflow-hidden cursor-pointer">
            <img 
              src={getImageUrl(leftBanner?.image) || 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=500&fit=crop'} 
              alt={leftBanner?.heading || 'Side Banner'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Central Area */}
        <div className="flex-1 h-full flex flex-col gap-4">
          {/* Top Hero Banner Area */}
          <div className="h-[250px] relative rounded overflow-hidden cursor-pointer group">
            <img 
              src={getImageUrl(currentBanner.image) || currentBanner.image} 
              alt={currentBanner.heading}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div 
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background: currentBanner.overlayColor ? `${currentBanner.overlayColor}${Math.round((currentBanner.overlayOpacity || 0.3) * 255).toString(16).padStart(2, '0')}` : 'rgba(0,0,0,0.3)'
              }}
            >
              <div className="text-center text-white">
                <h2 
                  className="text-2xl lg:text-3xl font-bold mb-2"
                  style={{ color: currentBanner.textColor || '#ffffff' }}
                >
                  {currentBanner.heading}
                </h2>
                {currentBanner.subHeading && (
                  <p 
                    className="text-lg mb-4"
                    style={{ color: currentBanner.textColor || '#ffffff' }}
                  >
                    {currentBanner.subHeading}
                  </p>
                )}
                {currentBanner.buttonText && (
                  <button className="px-6 py-3 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors">
                    {currentBanner.buttonText}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Two Horizontal Banners */}
          <div className="h-[246px] flex gap-4">
            <div className="flex-1 relative rounded overflow-hidden cursor-pointer group">
              <img 
                src={getImageUrl(bottomLeftBanner?.image) || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop'} 
                alt={bottomLeftBanner?.heading || 'Makeup Collection'} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {bottomLeftBanner && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-start px-6">
                  <div className="text-left text-white">
                    <h3 className="text-xl font-bold mb-2">{bottomLeftBanner.heading}</h3>
                    {bottomLeftBanner.subHeading && (
                      <p className="text-sm mb-3">{bottomLeftBanner.subHeading}</p>
                    )}
                    {bottomLeftBanner.buttonText && (
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors">
                        {bottomLeftBanner.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 relative rounded overflow-hidden cursor-pointer group">
              <img 
                src={getImageUrl(bottomRightBanner?.image) || 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400&h=250&fit=crop'} 
                alt={bottomRightBanner?.heading || 'Skincare Essentials'} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {bottomRightBanner && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-end px-6">
                  <div className="text-right text-white">
                    <h3 className="text-xl font-bold mb-2">{bottomRightBanner.heading}</h3>
                    {bottomRightBanner.subHeading && (
                      <p className="text-sm mb-3">{bottomRightBanner.subHeading}</p>
                    )}
                    {bottomRightBanner.buttonText && (
                      <button className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors">
                        {bottomRightBanner.buttonText}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side Banner */}
        <div className="w-[200px] h-full">
          <div className="relative w-full h-full rounded overflow-hidden cursor-pointer">
            <img 
              src={getImageUrl(rightBanner?.image) || 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200&h=500&fit=crop'} 
              alt={rightBanner?.heading || 'Side Banner'} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewHeroSection;