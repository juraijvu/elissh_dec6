// Banner System Test Script
// Run this in browser console to test banner functionality

console.log('🧪 Testing Banner System...');

// Test 1: Check API endpoints
async function testBannerAPI() {
  console.log('📡 Testing Banner API endpoints...');
  
  const areas = ['hero-slider', 'hero-left', 'hero-right', 'hero-bottom-left', 'hero-bottom-right'];
  
  for (const area of areas) {
    try {
      const response = await fetch(`/api/banner/${area}`);
      const data = await response.json();
      console.log(`✅ ${area}:`, data.banners?.length || 0, 'banners');
    } catch (error) {
      console.error(`❌ ${area}:`, error.message);
    }
  }
}

// Test 2: Check event system
function testEventSystem() {
  console.log('🎯 Testing Event System...');
  
  // Listen for banner updates
  window.addEventListener('bannersUpdated', () => {
    console.log('✅ bannersUpdated event received!');
  });
  
  // Trigger test event
  setTimeout(() => {
    console.log('📢 Dispatching test bannersUpdated event...');
    window.dispatchEvent(new CustomEvent('bannersUpdated'));
  }, 1000);
}

// Test 3: Check image URLs
function testImageURLs() {
  console.log('🖼️ Testing Image URL construction...');
  
  const testImages = [
    '/uploads/banners/test.jpg',
    'https://example.com/image.jpg',
    null,
    undefined
  ];
  
  testImages.forEach(image => {
    const getImageUrl = (img) => {
      if (!img) return null;
      if (img.startsWith('http')) return img;
      const baseUrl = import.meta?.env?.VITE_API_URL?.replace('/api', '') || 'http://elissh.com';
      return `${baseUrl}${img}`;
    };
    
    console.log(`Input: ${image} → Output: ${getImageUrl(image)}`);
  });
}

// Run all tests
async function runAllTests() {
  await testBannerAPI();
  testEventSystem();
  testImageURLs();
  console.log('🎉 Banner system tests completed!');
}

// Auto-run tests
runAllTests();