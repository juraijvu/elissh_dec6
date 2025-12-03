import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Search, Globe, Image, Twitter, Facebook } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiCall } from '@/lib/api';

const SEOManager = () => {
  const { toast } = useToast();
  const [seoPages, setSeoPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSEO, setEditingSEO] = useState(null);

  const [formData, setFormData] = useState({
    page: '',
    title: '',
    description: '',
    keywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterTitle: '',
    twitterDescription: '',
    twitterImage: '',
    canonicalUrl: '',
    robots: 'index, follow',
    isActive: true
  });

  const predefinedPages = [
    { value: 'home', label: 'Homepage', path: '/' },
    { value: 'about', label: 'About Us', path: '/about' },
    { value: 'contact', label: 'Contact Us', path: '/contact' },
    { value: 'brands', label: 'Brands', path: '/brands' },
    { value: 'sale', label: 'Sale Page', path: '/sale' },
    { value: 'cart', label: 'Shopping Cart', path: '/cart' },
    { value: 'checkout', label: 'Checkout', path: '/checkout' },
    { value: 'login', label: 'Login', path: '/login' },
    { value: 'register', label: 'Register', path: '/register' },
    { value: 'profile', label: 'User Profile', path: '/profile' },
    { value: 'wishlist', label: 'Wishlist', path: '/wishlist' },
    { value: 'orders', label: 'My Orders', path: '/orders' },
    { value: 'search', label: 'Search Results', path: '/search' }
  ];

  useEffect(() => {
    fetchSEOPages();
  }, []);

  const fetchSEOPages = async () => {
    try {
      const response = await apiCall('/seo/admin/all');
      const data = await response.json();
      
      if (data.success) {
        setSeoPages(data.pages);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load SEO pages',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiCall('/seo', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: 'Success',
          description: data.message
        });
        fetchSEOPages();
        resetForm();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save SEO data',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (seo) => {
    setEditingSEO(seo);
    setFormData({
      page: seo.page,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords || '',
      ogTitle: seo.ogTitle || '',
      ogDescription: seo.ogDescription || '',
      ogImage: seo.ogImage || '',
      twitterTitle: seo.twitterTitle || '',
      twitterDescription: seo.twitterDescription || '',
      twitterImage: seo.twitterImage || '',
      canonicalUrl: seo.canonicalUrl || '',
      robots: seo.robots || 'index, follow',
      isActive: seo.isActive
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this SEO configuration?')) {
      try {
        const response = await apiCall(`/seo/${id}`, {
          method: 'DELETE'
        });
        
        const data = await response.json();
        
        if (data.success) {
          toast({
            title: 'Success',
            description: 'SEO data deleted successfully'
          });
          fetchSEOPages();
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete SEO data',
          variant: 'destructive'
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      page: '',
      title: '',
      description: '',
      keywords: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      canonicalUrl: '',
      robots: 'index, follow',
      isActive: true
    });
    setEditingSEO(null);
    setIsDialogOpen(false);
  };

  const getPageLabel = (page) => {
    const predefined = predefinedPages.find(p => p.value === page);
    return predefined ? predefined.label : page;
  };

  const getPagePath = (page) => {
    const predefined = predefinedPages.find(p => p.value === page);
    return predefined ? predefined.path : `/${page}`;
  };

  return (
    <div className="p-6 pt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">SEO Management</h1>
          <p className="text-muted-foreground">Manage SEO settings for all website pages</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add SEO Page
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSEO ? 'Edit SEO Settings' : 'Add SEO Page'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic SEO */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Basic SEO
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="page">Page *</Label>
                    <Select value={formData.page} onValueChange={(value) => setFormData(prev => ({ ...prev, page: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select page" />
                      </SelectTrigger>
                      <SelectContent>
                        {predefinedPages.map(page => (
                          <SelectItem key={page.value} value={page.value}>
                            {page.label} ({page.path})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-6">
                    <Switch
                      id="isActive"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                    />
                    <Label htmlFor="isActive">Active</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Page Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Elissh Beauty - Premium Cosmetics & Beauty Products in UAE"
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 50-60 characters ({formData.title.length}/60)
                  </p>
                </div>

                <div>
                  <Label htmlFor="description">Meta Description *</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Shop authentic beauty products in UAE. Makeup, skincare, haircare & fragrance with free shipping over 100 AED."
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Recommended: 150-160 characters ({formData.description.length}/160)
                  </p>
                </div>

                <div>
                  <Label htmlFor="keywords">Keywords</Label>
                  <Input
                    id="keywords"
                    value={formData.keywords}
                    onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
                    placeholder="beauty products, cosmetics, makeup, skincare, UAE, Dubai"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="canonicalUrl">Canonical URL</Label>
                    <Input
                      id="canonicalUrl"
                      value={formData.canonicalUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, canonicalUrl: e.target.value }))}
                      placeholder="https://elisshbeauty.ae/"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="robots">Robots</Label>
                    <Select value={formData.robots} onValueChange={(value) => setFormData(prev => ({ ...prev, robots: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="index, follow">Index, Follow</SelectItem>
                        <SelectItem value="noindex, nofollow">No Index, No Follow</SelectItem>
                        <SelectItem value="index, nofollow">Index, No Follow</SelectItem>
                        <SelectItem value="noindex, follow">No Index, Follow</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Open Graph */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Facebook className="w-5 h-5" />
                  Open Graph (Facebook)
                </h3>
                
                <div>
                  <Label htmlFor="ogTitle">OG Title</Label>
                  <Input
                    id="ogTitle"
                    value={formData.ogTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, ogTitle: e.target.value }))}
                    placeholder="Leave empty to use page title"
                  />
                </div>

                <div>
                  <Label htmlFor="ogDescription">OG Description</Label>
                  <Textarea
                    id="ogDescription"
                    rows={2}
                    value={formData.ogDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, ogDescription: e.target.value }))}
                    placeholder="Leave empty to use meta description"
                  />
                </div>

                <div>
                  <Label htmlFor="ogImage">OG Image URL</Label>
                  <Input
                    id="ogImage"
                    value={formData.ogImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, ogImage: e.target.value }))}
                    placeholder="https://elisshbeauty.ae/images/og-image.jpg"
                  />
                </div>
              </div>

              {/* Twitter */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Twitter className="w-5 h-5" />
                  Twitter Cards
                </h3>
                
                <div>
                  <Label htmlFor="twitterTitle">Twitter Title</Label>
                  <Input
                    id="twitterTitle"
                    value={formData.twitterTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitterTitle: e.target.value }))}
                    placeholder="Leave empty to use OG title or page title"
                  />
                </div>

                <div>
                  <Label htmlFor="twitterDescription">Twitter Description</Label>
                  <Textarea
                    id="twitterDescription"
                    rows={2}
                    value={formData.twitterDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitterDescription: e.target.value }))}
                    placeholder="Leave empty to use OG description or meta description"
                  />
                </div>

                <div>
                  <Label htmlFor="twitterImage">Twitter Image URL</Label>
                  <Input
                    id="twitterImage"
                    value={formData.twitterImage}
                    onChange={(e) => setFormData(prev => ({ ...prev, twitterImage: e.target.value }))}
                    placeholder="Leave empty to use OG image"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingSEO ? 'Update' : 'Create'} SEO Settings
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* SEO Pages List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {seoPages.map((seo) => (
            <Card key={seo.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{getPageLabel(seo.page)}</h3>
                      <Badge variant={seo.isActive ? 'default' : 'secondary'}>
                        {seo.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getPagePath(seo.page)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Title:</p>
                        <p className="text-sm">{seo.title}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-green-600">Description:</p>
                        <p className="text-sm text-muted-foreground">{seo.description}</p>
                      </div>
                      
                      {seo.keywords && (
                        <div>
                          <p className="text-sm font-medium text-purple-600">Keywords:</p>
                          <p className="text-sm text-muted-foreground">{seo.keywords}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs">
                      {seo.ogTitle && <Badge variant="outline">OG Title</Badge>}
                      {seo.ogImage && <Badge variant="outline">OG Image</Badge>}
                      {seo.twitterTitle && <Badge variant="outline">Twitter Card</Badge>}
                      {seo.canonicalUrl && <Badge variant="outline">Canonical URL</Badge>}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(seo)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(seo.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* SEO Statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            SEO Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{seoPages.length}</p>
              <p className="text-sm text-muted-foreground">Total Pages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{seoPages.filter(s => s.isActive).length}</p>
              <p className="text-sm text-muted-foreground">Active Pages</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{seoPages.filter(s => s.ogImage).length}</p>
              <p className="text-sm text-muted-foreground">With OG Images</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{predefinedPages.length - seoPages.length}</p>
              <p className="text-sm text-muted-foreground">Missing Pages</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SEOManager;