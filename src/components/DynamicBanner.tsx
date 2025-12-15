import { useState, useEffect } from 'react';
import { bannerAPI } from '@/lib/api';

interface DynamicBannerProps {
  area: string;
  className?: string;
  fallbackImage?: string;
  aspectRatio?: string;
  bannerIndex?: number;
}

const DynamicBanner = ({ area, className = '', fallbackImage, aspectRatio = 'aspect-[16/9]', bannerIndex = 0 }: DynamicBannerProps) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  const getImageUrl = (image) => {
    if (!image) return null;
    if (image.startsWith('http')) return image;
    const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://elissh.com';
    return `${baseUrl}${image}`;
  };

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await bannerAPI.getBanners(area);
        const bannersData = response.banners || [];
        setBanners(bannersData);
      } catch (error) {
        console.error(`Failed to load banners for area: ${area}`, error);
      } finally {
        setLoading(false);
      }
    };

    loadBanners();
    
    // Listen for banner updates
    const handleBannerUpdate = () => {
      console.log(`🔄 Banner update event for area: ${area}, refreshing...`);
      setTimeout(() => {
        loadBanners();
      }, 100);
    };
    
    window.addEventListener('bannersUpdated', handleBannerUpdate);
    
    return () => {
      window.removeEventListener('bannersUpdated', handleBannerUpdate);
    };
  }, [area]);

  const handleBannerClick = async (banner) => {
    if (banner.link) {
      try {
        await bannerAPI.trackClick(banner.id);
        window.location.href = banner.link;
      } catch (error) {
        console.error('Failed to track banner click:', error);
        window.location.href = banner.link;
      }
    }
  };

  if (loading) {
    return (
      <div className={`${className} ${aspectRatio} bg-gray-200 animate-pulse rounded-lg`}>
        <div className="w-full h-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
      </div>
    );
  }

  if (!banners.length && fallbackImage) {
    return (
      <div className={`${className} ${aspectRatio} relative rounded-lg overflow-hidden cursor-pointer`}>
        <img 
          src={fallbackImage} 
          alt="Banner" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
            <p className="text-sm opacity-90">New content will be available here</p>
          </div>
        </div>
      </div>
    );
  }

  if (!banners.length) {
    return null;
  }

  // Get specific banner by index or first available
  const banner = banners[bannerIndex] || banners[0];
  
  if (banner) {
    return (
      <div 
        className={`${className} ${aspectRatio} relative rounded-lg overflow-hidden cursor-pointer group`}
        onClick={() => handleBannerClick(banner)}
      >
        <img 
          src={getImageUrl(banner.image)}
          alt={banner.heading || 'Banner'} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {(banner.heading || banner.subHeading) && (
          <div 
            className={`absolute inset-0 flex items-center justify-${banner.textAlignment || 'center'}`}
            style={{
              background: banner.overlayColor ? `${banner.overlayColor}${Math.round((banner.overlayOpacity || 0.3) * 255).toString(16).padStart(2, '0')}` : 'rgba(0,0,0,0.3)'
            }}
          >
            <div className={`text-${banner.textAlignment || 'center'} px-6`}>
              {banner.heading && (
                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: banner.textColor || '#ffffff' }}
                >
                  {banner.heading}
                </h3>
              )}
              {banner.subHeading && (
                <p 
                  className="text-sm opacity-90 mb-3"
                  style={{ color: banner.textColor || '#ffffff' }}
                >
                  {banner.subHeading}
                </p>
              )}
              {banner.buttonText && (
                <button 
                  className="px-4 py-2 bg-primary text-primary-foreground rounded font-semibold hover:bg-primary/90 transition-colors"
                >
                  {banner.buttonText}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // No banner available
  return null;
};

// Unused code - keeping for reference
const UnusedGridLayout = ({ banners, className, aspectRatio, handleBannerClick }) => {
  return (
    <>
      {banners.map((banner) => (
        <div 
          key={banner.id}
          className={`${className} ${aspectRatio} relative rounded-lg overflow-hidden cursor-pointer group shadow-soft`}
          onClick={() => handleBannerClick(banner)}
        >
          <img 
            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://elissh.com'}${banner.image}`}
            alt={banner.heading || 'Banner'} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {(banner.heading || banner.subHeading) && (
            <div 
              className={`absolute inset-0 flex items-center justify-${banner.textAlignment || 'center'}`}
              style={{
                background: banner.overlayColor ? `${banner.overlayColor}${Math.round((banner.overlayOpacity || 0.3) * 255).toString(16).padStart(2, '0')}` : 'rgba(0,0,0,0.3)'
              }}
            >
              <div className={`text-${banner.textAlignment || 'center'} px-4`}>
                {banner.heading && (
                  <h3 
                    className="text-lg font-bold mb-1"
                    style={{ color: banner.textColor || '#ffffff' }}
                  >
                    {banner.heading}
                  </h3>
                )}
                {banner.subHeading && (
                  <p 
                    className="text-xs opacity-90"
                    style={{ color: banner.textColor || '#ffffff' }}
                  >
                    {banner.subHeading}
                  </p>
                )}
                {banner.buttonText && (
                  <button 
                    className="mt-2 px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    {banner.buttonText}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default DynamicBanner;