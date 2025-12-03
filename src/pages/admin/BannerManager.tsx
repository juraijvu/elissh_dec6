import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Upload, Monitor } from 'lucide-react';
import { bannerAPI } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const BannerManager = () => {
  const { toast } = useToast();
  const [banners, setBanners] = useState({});
  const [loading, setLoading] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [selectedArea, setSelectedArea] = useState('hero-slider');
  const [imageFile, setImageFile] = useState(null);
  const [mobileImageFile, setMobileImageFile] = useState(null);

  const bannerAreas = [
    // HOMEPAGE BANNERS
    { 
      key: 'hero-slider', 
      label: '🏠 Homepage Hero Slider', 
      description: 'Main rotating carousel at top of homepage',
      location: 'Homepage → Top section → Main carousel (5 slides max)',
      size: '1920x600px (desktop), 768x400px (mobile)',
      category: 'Homepage',
      priority: 'High',
      example: 'Perfect for: New collections, major sales, brand campaigns'
    },
    { 
      key: 'hero-left', 
      label: '🏠 Homepage Hero Left', 
      description: 'Vertical banner on left side of hero section',
      location: 'Homepage → Hero section → Left vertical area',
      size: '300x500px (desktop), 250x300px (mobile)',
      category: 'Homepage',
      priority: 'Medium',
      example: 'Perfect for: Tutorials, membership offers, special features'
    },
    { 
      key: 'hero-right', 
      label: '🏠 Homepage Hero Right', 
      description: 'Vertical banner on right side of hero section',
      location: 'Homepage → Hero section → Right vertical area',
      size: '300x500px (desktop), 250x300px (mobile)',
      category: 'Homepage',
      priority: 'Medium',
      example: 'Perfect for: VIP programs, gift cards, consultations'
    },
    { 
      key: 'hero-bottom-left', 
      label: '🏠 Homepage Hero Bottom Left', 
      description: 'Horizontal banner at bottom left of hero',
      location: 'Homepage → Hero section → Bottom left area',
      size: '600x300px (desktop), 400x200px (mobile)',
      category: 'Homepage',
      priority: 'Medium',
      example: 'Perfect for: Gift cards, seasonal offers, services'
    },
    { 
      key: 'hero-bottom-right', 
      label: '🏠 Homepage Hero Bottom Right', 
      description: 'Horizontal banner at bottom right of hero',
      location: 'Homepage → Hero section → Bottom right area',
      size: '600x300px (desktop), 400x200px (mobile)',
      category: 'Homepage',
      priority: 'Medium',
      example: 'Perfect for: Consultations, delivery info, support'
    },
    { 
      key: 'after-special-offers', 
      label: '🏠 After Special Offers', 
      description: 'Three banners after special offers carousel',
      location: 'Homepage → After "Special Offers" product section',
      size: '400x250px (desktop), 300x200px (mobile)',
      category: 'Homepage',
      priority: 'Medium',
      example: 'Perfect for: Bestsellers, certifications, delivery info'
    },
    { 
      key: 'new-arrival-banner', 
      label: '🏠 New Arrivals Grid', 
      description: 'Eight banners in grid layout for new products',
      location: 'Homepage → New Arrivals section → Product grid',
      size: '300x400px (desktop), 250x300px (mobile)',
      category: 'Homepage',
      priority: 'High',
      example: 'Perfect for: New product launches, featured items'
    },
    { 
      key: 'wide-banner-top', 
      label: '🏠 Wide Banner (Top)', 
      description: 'Full-width promotional banner',
      location: 'Homepage → Top wide promotional area',
      size: '1200x300px (desktop), 600x200px (mobile)',
      category: 'Homepage',
      priority: 'High',
      example: 'Perfect for: Major sales, Black Friday, site-wide offers'
    },
    { 
      key: 'wide-banner-bottom', 
      label: '🏠 Wide Banner (Bottom)', 
      description: 'Full-width promotional banner at bottom',
      location: 'Homepage → Bottom wide promotional area',
      size: '1200x300px (desktop), 600x200px (mobile)',
      category: 'Homepage',
      priority: 'Medium',
      example: 'Perfect for: Shipping info, membership, newsletters'
    },
    
    // CATEGORY PAGE BANNERS
    { 
      key: 'category-page-banner', 
      label: '📂 Category Pages Banner', 
      description: 'Banner that appears on all category pages',
      location: 'All Category Pages → After every 3 rows of products',
      size: '1200x300px (desktop), 600x200px (mobile)',
      category: 'Category Pages',
      priority: 'Medium',
      example: 'Perfect for: Category-specific offers, featured products, brand highlights'
    }
  ];

  const [bannerForm, setBannerForm] = useState({
    name: '',
    area: 'hero-slider',
    position: 'main',
    heading: '',
    subHeading: '',
    description: '',
    image: '',
    mobileImage: '',
    link: '',
    buttonText: 'Shop Now',
    textColor: '#ffffff',
    backgroundColor: '',
    overlayColor: '#000000',
    overlayOpacity: 0.3,
    textAlignment: 'center',
    isActive: true,
    sortOrder: 0
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('=== LOADING BANNERS ===');
      
      // Fetch banners from all areas
      const areas = ['hero-slider', 'hero-left', 'hero-right', 'hero-bottom-left', 'hero-bottom-right', 
                    'after-special-offers', 'new-arrival-banner', 'wide-banner-top', 'wide-banner-bottom', 
                    'category-page-banner'];
      
      const allBanners = {};
      
      for (const area of areas) {
        try {
          console.log(`Loading banners for area: ${area}`);
          const response = await fetch(`http://localhost:5001/api/banner/${area}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          const data = await response.json();
          console.log(`Response for ${area}:`, data);
          
          if (data.success && data.banners) {
            allBanners[area] = data.banners;
            console.log(`Loaded ${data.banners.length} banners for ${area}`);
          } else {
            allBanners[area] = [];
            console.log(`No banners found for ${area}`);
          }
        } catch (areaError) {
          console.error(`Failed to load banners for area ${area}:`, areaError);
          allBanners[area] = [];
        }
      }
      
      console.log('All loaded banners:', allBanners);
      setBanners(allBanners);
    } catch (error) {
      console.error('Banner loading error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load banners',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBanner = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please login again.');
      }
      
      console.log('=== SAVING BANNER ===');
      console.log('Editing banner:', editingBanner?.id);
      console.log('Form data:', bannerForm);
      
      const bannerData = {
        ...bannerForm,
        image: imageFile ? 'will-be-uploaded' : bannerForm.image,
        mobileImage: mobileImageFile ? 'will-be-uploaded' : bannerForm.mobileImage
      };
      
      console.log('Sending banner data:', bannerData);
      
      let response;
      if (editingBanner) {
        console.log('Updating banner with ID:', editingBanner.id);
        response = await fetch(`http://localhost:5001/api/banner/${editingBanner.id}/json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bannerData)
        });
      } else {
        console.log('Creating new banner');
        response = await fetch('http://localhost:5001/api/banner/json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bannerData)
        });
      }
      
      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: editingBanner ? 'Banner updated successfully' : 'Banner created successfully'
        });
        resetForm();
        // Immediately reload banners
        await loadBanners();
        // Trigger a refresh of homepage banners with multiple events
        console.log('🚀 Dispatching bannersUpdated events...');
        window.dispatchEvent(new CustomEvent('bannersUpdated'));
        window.dispatchEvent(new CustomEvent('bannerChanged'));
        // Also dispatch with delays to ensure components are ready
        setTimeout(() => {
          console.log('🚀 Dispatching delayed bannersUpdated events...');
          window.dispatchEvent(new CustomEvent('bannersUpdated'));
          window.dispatchEvent(new CustomEvent('bannerChanged'));
        }, 200);
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('bannersUpdated'));
        }, 500);
      } else {
        throw new Error(result.message || 'Failed to save banner');
      }
    } catch (error) {
      console.error('=== SAVE BANNER ERROR ===');
      console.error('Error details:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save banner',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditBanner = (banner) => {
    setEditingBanner(banner);
    setBannerForm(banner);
  };

  const handleDeleteBanner = async (bannerId) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/banner/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const result = await response.json();
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Banner deleted successfully'
        });
        loadBanners();
      } else {
        throw new Error(result.message || 'Failed to delete banner');
      }
    } catch (error) {
      console.error('Delete banner error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete banner',
        variant: 'destructive'
      });
    }
  };

  const resetForm = () => {
    setBannerForm({
      name: '',
      area: selectedArea,
      position: 'main',
      heading: '',
      subHeading: '',
      description: '',
      image: '',
      mobileImage: '',
      link: '',
      buttonText: 'Shop Now',
      textColor: '#ffffff',
      backgroundColor: '',
      overlayColor: '#000000',
      overlayOpacity: 0.3,
      textAlignment: 'center',
      isActive: true,
      sortOrder: 0
    });
    setEditingBanner(null);
    setImageFile(null);
    setMobileImageFile(null);
  };

  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === 'image') {
        setImageFile(file);
      } else {
        setMobileImageFile(file);
      }
    }
  };

  return (
    <div className="p-6 pt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Banner Management System</h1>
          <p className="text-muted-foreground">Control all website banners with precise placement control</p>
          <div className="mt-3 space-y-2">
            <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
              <div className="font-semibold mb-1">📍 Banner Locations Guide:</div>
              <div className="text-xs space-y-1">
                <div>🏠 <strong>Homepage:</strong> Hero slider, side banners, promotional areas, new arrivals grid</div>
                <div>📂 <strong>Category Pages:</strong> Banners appear after every 3 rows of products</div>
                <div>🎯 <strong>Priority:</strong> High = Main focus areas, Medium = Supporting areas</div>
              </div>
            </div>
            <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
              <div className="font-semibold mb-1">✨ Quick Start:</div>
              <div className="text-xs">1. Select a banner area → 2. Fill in details → 3. Upload images → 4. Save banner</div>
            </div>
          </div>
        </div>
        <Button onClick={resetForm}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Banner
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Banner Form */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editingBanner ? 'Edit Banner' : 'Create New Banner'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Banner Name</Label>
                <Input
                  id="name"
                  value={bannerForm.name}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Internal name for banner"
                />
              </div>

              <div>
                <Label htmlFor="area">Banner Area</Label>
                <Select value={bannerForm.area} onValueChange={(value) => setBannerForm(prev => ({ ...prev, area: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2 text-xs font-semibold text-gray-600 border-b">🏠 Homepage Areas</div>
                    {bannerAreas.filter(area => area.category === 'Homepage').map(area => (
                      <SelectItem key={area.key} value={area.key}>
                        <div className="flex items-center justify-between w-full">
                          <span>{area.label}</span>
                          <Badge variant={area.priority === 'High' ? 'default' : 'secondary'} className="text-xs ml-2">
                            {area.priority}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                    <div className="p-2 text-xs font-semibold text-gray-600 border-b border-t mt-1">📂 Category Pages</div>
                    {bannerAreas.filter(area => area.category === 'Category Pages').map(area => (
                      <SelectItem key={area.key} value={area.key}>
                        <div className="flex items-center justify-between w-full">
                          <span>{area.label}</span>
                          <Badge variant={area.priority === 'High' ? 'default' : 'secondary'} className="text-xs ml-2">
                            {area.priority}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {bannerForm.area && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <div className="font-semibold text-blue-800">Selected Area Info:</div>
                    <div className="text-blue-600 mt-1">
                      📍 {bannerAreas.find(a => a.key === bannerForm.area)?.location}
                    </div>
                    <div className="text-blue-600">
                      📐 {bannerAreas.find(a => a.key === bannerForm.area)?.size}
                    </div>
                    <div className="text-green-600 mt-1">
                      💡 {bannerAreas.find(a => a.key === bannerForm.area)?.example}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="heading">Heading</Label>
                <Input
                  id="heading"
                  value={bannerForm.heading}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, heading: e.target.value }))}
                  placeholder="Main banner heading"
                />
              </div>

              <div>
                <Label htmlFor="subHeading">Sub Heading</Label>
                <Input
                  id="subHeading"
                  value={bannerForm.subHeading}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, subHeading: e.target.value }))}
                  placeholder="Secondary text"
                />
              </div>

              {bannerForm.area === 'category-page-banner' && (
                <div>
                  <Label htmlFor="position">Category Target</Label>
                  <Select value={bannerForm.position} onValueChange={(value) => setBannerForm(prev => ({ ...prev, position: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="main">All Categories</SelectItem>
                      <SelectItem value="makeup">Makeup Category Only</SelectItem>
                      <SelectItem value="skincare">Skincare Category Only</SelectItem>
                      <SelectItem value="haircare">Haircare Category Only</SelectItem>
                      <SelectItem value="fragrance">Fragrance Category Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Choose which category pages this banner should appear on
                  </p>
                </div>
              )}

              <div>
                <Label htmlFor="link">Banner Link</Label>
                <Input
                  id="link"
                  value={bannerForm.link}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, link: e.target.value }))}
                  placeholder="/category/makeup"
                />
              </div>

              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={bannerForm.buttonText}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, buttonText: e.target.value }))}
                  placeholder="Shop Now"
                />
              </div>

              <div>
                <Label htmlFor="sortOrder">Display Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={bannerForm.sortOrder}
                  onChange={(e) => setBannerForm(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first (0 = first, 1 = second, etc.)
                </p>
              </div>

              <div>
                <Label>Desktop Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                    className="hidden"
                    id="desktop-image"
                  />
                  <label htmlFor="desktop-image" className="cursor-pointer">
                    {imageFile ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(imageFile)} 
                          alt="Preview" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-gray-600">{imageFile.name}</p>
                      </div>
                    ) : editingBanner?.image ? (
                      <div className="space-y-2">
                        <img 
                          src={editingBanner.image.startsWith('http') ? editingBanner.image : `http://localhost:5001${editingBanner.image}`} 
                          alt="Current" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-gray-600">Current image - click to change</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Upload desktop image</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div>
                <Label>Mobile Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'mobileImage')}
                    className="hidden"
                    id="mobile-image"
                  />
                  <label htmlFor="mobile-image" className="cursor-pointer">
                    {mobileImageFile ? (
                      <div className="space-y-2">
                        <img 
                          src={URL.createObjectURL(mobileImageFile)} 
                          alt="Mobile Preview" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-gray-600">{mobileImageFile.name}</p>
                      </div>
                    ) : editingBanner?.mobileImage ? (
                      <div className="space-y-2">
                        <img 
                          src={editingBanner.mobileImage.startsWith('http') ? editingBanner.mobileImage : `http://localhost:5001${editingBanner.mobileImage}`} 
                          alt="Current Mobile" 
                          className="w-full h-32 object-cover rounded"
                        />
                        <p className="text-sm text-gray-600">Current mobile image - click to change</p>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">Upload mobile image (optional)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={bannerForm.isActive}
                  onCheckedChange={(checked) => setBannerForm(prev => ({ ...prev, isActive: checked }))}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveBanner} className="flex-1" disabled={loading}>
                  {loading ? 'Saving...' : (editingBanner ? 'Update' : 'Create')} Banner
                </Button>
                {editingBanner && (
                  <Button variant="outline" onClick={resetForm} disabled={loading}>
                    Cancel
                  </Button>
                )}
              </div>
              
              {editingBanner && (
                <div className="mt-4 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-medium mb-2">Debug Info:</p>
                  <p className="text-xs text-gray-600">Editing Banner ID: {editingBanner.id}</p>
                  <p className="text-xs text-gray-600">Current Name: {bannerForm.name}</p>
                  <p className="text-xs text-gray-600">Current Area: {bannerForm.area}</p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-2"
                    onClick={async () => {
                      const token = localStorage.getItem('token');
                      const response = await fetch(`http://localhost:5001/api/banner/test/${editingBanner.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                      });
                      const data = await response.json();
                      console.log('Current banner in DB:', data);
                      alert(`Current banner name in DB: ${data.banner?.name}`);
                    }}
                  >
                    Test DB State
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Banner Areas */}
        <div className="lg:col-span-2">
          {/* Banner Areas by Category */}
          <div className="space-y-6 mb-6">
            {/* Homepage Banners */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                🏠 Homepage Banners
                <Badge variant="outline" className="ml-2">
                  {bannerAreas.filter(a => a.category === 'Homepage').reduce((sum, area) => sum + (banners[area.key]?.length || 0), 0)} total
                </Badge>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {bannerAreas.filter(area => area.category === 'Homepage').map(area => (
                  <div 
                    key={area.key}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedArea === area.key ? 'border-primary bg-primary/5 ring-2 ring-primary/20' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedArea(area.key)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm">{area.label}</h4>
                      <div className="flex gap-1">
                        <Badge variant={area.priority === 'High' ? 'default' : 'secondary'} className="text-xs">
                          {area.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {banners[area.key]?.length || 0}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{area.description}</p>
                    <div className="text-xs text-blue-600 mb-1 font-medium">
                      📍 {area.location}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      📐 {area.size}
                    </div>
                    <div className="text-xs text-green-600 bg-green-50 p-1 rounded">
                      💡 {area.example}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Category Page Banners */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                📂 Category Page Banners
                <Badge variant="outline" className="ml-2">
                  {banners['category-page-banner']?.length || 0} total
                </Badge>
              </h3>
              
              {/* Category-specific sections */}
              <div className="space-y-4">
                {['makeup', 'skincare', 'haircare', 'fragrance', 'main'].map(categoryType => {
                  const categoryBanners = banners['category-page-banner']?.filter(b => b.position === categoryType) || [];
                  const categoryLabel = categoryType === 'main' ? 'All Categories' : categoryType.charAt(0).toUpperCase() + categoryType.slice(1);
                  
                  return (
                    <div key={categoryType} className="border rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">
                          {categoryType === 'main' ? '🌐' : 
                           categoryType === 'makeup' ? '💄' :
                           categoryType === 'skincare' ? '🧴' :
                           categoryType === 'haircare' ? '💇' : '🌸'} {categoryLabel} Banners
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {categoryBanners.length} banners
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Wide banners that appear after every 3 rows on {categoryLabel.toLowerCase()} pages
                      </p>
                      <div className="text-xs text-blue-600 mb-1">
                        📍 {categoryType === 'main' ? 'All category pages' : `${categoryLabel} category page only`}
                      </div>
                      <div className="text-xs text-gray-500 mb-2">
                        📐 1200x300px (desktop), 600x200px (mobile)
                      </div>
                      <button 
                        className={`w-full text-left p-2 rounded text-xs transition-colors ${
                          selectedArea === 'category-page-banner' ? 'bg-primary text-primary-foreground' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        onClick={() => setSelectedArea('category-page-banner')}
                      >
                        Click to manage {categoryLabel.toLowerCase()} banners
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <h3>{bannerAreas.find(a => a.key === selectedArea)?.label}</h3>
                  <p className="text-sm text-muted-foreground">
                    {bannerAreas.find(a => a.key === selectedArea)?.description}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    📍 {bannerAreas.find(a => a.key === selectedArea)?.location}
                  </p>
                </div>
                <Badge variant="outline">
                  {banners[selectedArea]?.length || 0} banners
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {banners[selectedArea]?.map(banner => (
                  <Card key={banner.id} className="border">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4 flex-1">
                          {banner.image && (
                            <div className="relative">
                              <img 
                                src={banner.image.startsWith('http') ? banner.image : `http://localhost:5001${banner.image}`} 
                                alt={banner.name}
                                className="w-20 h-16 object-cover rounded border"
                                onError={(e) => {
                                  e.currentTarget.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=80&h=64&fit=crop';
                                }}
                              />
                              {banner.mobileImage && (
                                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded">
                                  📱
                                </div>
                              )}
                            </div>
                          )}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold">{banner.name}</h4>
                              {banner.isActive ? (
                                <Badge variant="default">Active</Badge>
                              ) : (
                                <Badge variant="secondary">Inactive</Badge>
                              )}
                              {banner.position && banner.position !== 'main' && (
                                <Badge variant="outline" className="text-xs">
                                  {banner.position}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              <strong>{banner.heading}</strong>
                              {banner.subHeading && ` - ${banner.subHeading}`}
                            </p>
                            <p className="text-xs text-muted-foreground mb-1">
                              Link: {banner.link || 'No link'}
                            </p>
                            <div className="flex gap-2 text-xs text-gray-500">
                              <span>Clicks: {banner.clickCount || 0}</span>
                              <span>•</span>
                              <span>Order: {banner.sortOrder || 0}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditBanner(banner)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteBanner(banner.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {(!banners[selectedArea] || banners[selectedArea].length === 0) && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No banners in this area yet</p>
                    <p className="text-sm">Create your first banner for {bannerAreas.find(a => a.key === selectedArea)?.label}</p>
                    <p className="text-xs mt-2 text-blue-600">
                      📍 Will appear: {bannerAreas.find(a => a.key === selectedArea)?.location}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BannerManager;